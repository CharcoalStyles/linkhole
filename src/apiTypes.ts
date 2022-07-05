import { Link, Tag, TagOnLink } from "@prisma/client";

export type LinkApiResponse = Partial<Link> & {
  title: string;
  url: string;
  tags: Array<{
    tag: Tag;
  }>;
};
