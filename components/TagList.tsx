import { Chip, Stack } from "@mui/material";
import { Tag } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

type TagsListProps = {
  initTags: Tag[];
  onChange: (selectedTags: Array<Tag>) => void;
};

export const TagList = ({ initTags, onChange }: TagsListProps) => {
  const [tags, setTags] = useState<Array<Tag>>([]);
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>(initTags);

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
      direction="row"
      spacing={1}
      width="100%"
      overflow="auto"
      justifyContent="flex-start"
    >
      {tags.map((tag) => {
        const isSelected = selectedTags.map((t) => t.id).includes(tag.id);
        
        return (
          <Chip
            key={tag.id}
            label={tag.name}
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
