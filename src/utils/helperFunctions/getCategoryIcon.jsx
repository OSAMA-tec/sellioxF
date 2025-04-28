import { FaCogs } from "react-icons/fa"; // Default icon
import { iconMapper } from "../../data/icons";

export const getCategoryIcon = (header) => {
    return iconMapper[header.toLowerCase()] || FaCogs; // Default fallback icon
};
