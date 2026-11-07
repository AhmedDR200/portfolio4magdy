import { currentSkin } from "../../utils/theme";
import IntroFrontier from "./IntroFrontier";
import IntroLab from "./IntroLab";

type Props = {
  /** Called when the curtain starts lifting, so the hero can rise with it. */
  onReveal: () => void;
  /** Called once the curtain is fully off screen. */
  onDone: () => void;
};

// The first-visit intro of whichever skin is on: the lab's cold open (the
// default) or the frontier's shell and shot.
const Intro = (props: Props) => (currentSkin() === "bb" ? <IntroLab {...props} /> : <IntroFrontier {...props} />);

export default Intro;
