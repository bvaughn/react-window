export type Intent = "danger" | "none" | "primary" | "success" | "warning";

export type Section = {
  content: string;
  intent?: Intent;
};

export type ComponentPropMetadata = {
  description: Section[];
  html: string;
  name: string;
  required: boolean;
};

export type ComponentMetadata = {
  description: Section[];
  filePath: string;
  name: string;
  props: {
    [name: string]: ComponentPropMetadata;
  };
};

export type ImperativeHandleMethodMetadata = {
  description: Section[];
  html: string;
  name: string;
};

export type ImperativeHandleMetadata = {
  description: Section[];
  filePath: string;
  name: string;
  methods: ImperativeHandleMethodMetadata[];
};
