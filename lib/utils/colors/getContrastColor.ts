export function getContrastColor(hex: string) {
  switch (hex.length) {
    case 3: {
      hex =
        hex.charAt(0) +
        hex.charAt(0) +
        hex.charAt(1) +
        hex.charAt(1) +
        hex.charAt(2) +
        hex.charAt(2);
      break;
    }
    case 4: {
      hex =
        hex.charAt(1) +
        hex.charAt(1) +
        hex.charAt(2) +
        hex.charAt(2) +
        hex.charAt(3) +
        hex.charAt(3);
      break;
    }
    case 6: {
      break;
    }
    case 7: {
      hex = hex.substring(1);
      break;
    }
    default: {
      throw Error(`Invalid hex value: "${hex}"`);
    }
  }

  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!rgb) {
    throw Error(`Invalid hex value: "${hex}"`);
  }

  const red = parseInt(rgb[1], 16);
  const green = parseInt(rgb[2], 16);
  const blue = parseInt(rgb[3], 16);

  const brightness = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

  return brightness >= 128 ? "black" : "white";
}
