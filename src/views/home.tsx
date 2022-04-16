import { css, cx } from "@emotion/css";
import { useTheme, Text, FontWeights } from "@fluentui/react";
import { observer } from "mobx-react-lite";
import { HomeVM } from "../viewmodels/home-vm";

interface HomeProps extends ClassNameProp {
  vm: HomeVM;
}

const Home = observer(function Home({ vm, className }: HomeProps) {
  const theme = useTheme();
  return (
    <div className={cx(css({ padding: theme.spacing.m }), className)}>
      <div
        className={css({
          boxShadow: theme.effects.elevation8,
          padding: theme.spacing.m,
          display: "flex",
          flexDirection: "column",
          maxWidth: `600px`,
        })}
      >
        <div>
          <Text variant="mediumPlus" style={{ lineHeight: 1.4 }}>
            Welcome to the <strong className={css({ fontWeight: FontWeights.semibold })}>CyberToys</strong>: a collection of utilities that
            I've built myself to deal with the everyday developer's challenges.
          </Text>
        </div>
        <div className={css({ textAlign: "right", paddingTop: theme.spacing.m })}>
          <Text variant="small" className={css({ textAlign: "right" })}>
            Stefano
          </Text>
        </div>
      </div>
    </div>
  );
});

export default Home;
