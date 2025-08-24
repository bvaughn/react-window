import { indexToColumn } from "./shared";

// <begin>

function columnWidth(index: number) {
  switch (indexToColumn(index)) {
    case "address": {
      return 250;
    }
    case "email": {
      return 300;
    }
    case "job_title": {
      return 150;
    }
    case "timezone": {
      return 200;
    }
    case "zip": {
      return 75;
    }
    default: {
      return 100;
    }
  }
}

// <end>

export { columnWidth };
