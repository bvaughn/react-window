export type Intent = "danger" | "none" | "primary" | "success" | "warning";

export type ComponentPropMetadata = {
  description: string;
  html: string;
  info?: string;
  name: string;
  required: boolean;
  warning?: string;
};

export type ComponentMetadata = {
  filePath: string;
  name: string;
  props: {
    [name: string]: ComponentPropMetadata;
  };
};
