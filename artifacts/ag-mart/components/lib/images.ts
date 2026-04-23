export function getImage(name: string) {
  switch (name) {
    case "tomatoes.png":
      return require("@/assets/images/tomatoes.png");
    case "maize.png":
      return require("@/assets/images/maize.png");
    case "poultry.png":
      return require("@/assets/images/poultry.png");
    case "fish.png":
      return require("@/assets/images/fish.png");
    case "greens.png":
      return require("@/assets/images/greens.png");
    case "inputs.png":
      return require("@/assets/images/inputs.png");
    case "farmer.png":
      return require("@/assets/images/farmer.png");
    default:
      return require("@/assets/images/icon.png");
  }
}
