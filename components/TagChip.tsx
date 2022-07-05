import { Chip } from "@mui/material";
import { Tag } from "@prisma/client";

type MuiColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";
type MuiChipVariants = "filled" | "outlined";

type TagChpProps = {
  tag: Tag;
  onClick?: () => void;
  color?: MuiColor;
  variant?: MuiChipVariants;
};

export const TagChip = ({ tag, onClick, color, variant }: TagChpProps) => {
  return (
    <Chip
      label={tag.name}
      color={color ? color : "primary"}
      variant={variant ? variant : "filled"}
      {...(onClick ? { onClick: () => onClick() } : {})}
    />
  );
};
