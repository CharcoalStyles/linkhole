import { Check } from "@mui/icons-material";
import {
  Chip,
  IconButton,
  Input,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { Tag } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { TagChip } from "./TagChip";

type TagsListProps = {
  initTags: Tag[];
  onChange: (selectedTags: Array<Tag>) => void;
};

export const TagList = ({ initTags, onChange }: TagsListProps) => {
  const [tags, setTags] = useState<Array<Tag>>([]);
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>(initTags);

  const [addingNewTag, setAddingNewTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  function finishAddingTag() {
    const newTag = { name: newTagName, id: Math.random() * 10000 * -1 };
    setTags([...tags, newTag]);
    const newSelectedTags = [...selectedTags, newTag];
    setSelectedTags(newSelectedTags);
    setNewTagName("");
    setAddingNewTag(false);
    onChange(newSelectedTags);
  }

  const getTags = async () => {
    const res = await axios.get<Array<Tag>>("/api/tag");
    setTags(res.data);
  };

  useEffect(() => {
    getTags();
  }, []);

  useEffect(() => {
    setSelectedTags(initTags);
  }, [initTags]);

  return (
    <Stack
      paddingY={1}
      direction="row"
      spacing={1}
      flexWrap="wrap"
      justifyContent="flex-start"
    >
      {addingNewTag ? (
        <TextField
          type="text"
          size="small"
          color="primary"
          variant="standard"
          InputProps={{
            style: { backgroundColor: "white", paddingLeft: "0.5em" },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={finishAddingTag}
                  onMouseDown={finishAddingTag}
                >
                  <Check />
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={newTagName}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              finishAddingTag();
            }
          }}
          onChange={(e) => setNewTagName(e.target.value)}
        />
      ) : (
        <Chip
          label="+"
          color="info"
          variant="filled"
          onClick={() => setAddingNewTag(true)}
        />
      )}
      {tags.map((tag) => {
        const isSelected = selectedTags.map((t) => t.id).includes(tag.id);

        return (
          <TagChip
            key={tag.id}
            tag={tag}
            color={isSelected ? "primary" : "secondary"}
            variant={isSelected ? "filled" : "outlined"}
            onClick={() => {
              let newSelectedTags = selectedTags.slice();
              if (isSelected) {
                newSelectedTags = newSelectedTags.filter(
                  (t) => t.id !== tag.id
                );
              } else {
                newSelectedTags = [...newSelectedTags, tag];
              }
              onChange(newSelectedTags);
              setSelectedTags(newSelectedTags);
            }}
          />
        );
      })}
    </Stack>
  );
};
