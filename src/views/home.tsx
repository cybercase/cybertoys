import { css, cx } from "@emotion/css";
import { useTheme, Text, FontWeights, Link } from "@fluentui/react";
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
          backgroundColor: theme.semanticColors.bodyBackground,
          padding: theme.spacing.m,
          display: "flex",
          flexDirection: "column",
          maxWidth: `600px`,
        })}
      >
        <div>
          <Text variant="mediumPlus" style={{ lineHeight: 1.4 }}>
            Welcome to the <strong className={css({ fontWeight: FontWeights.semibold })}>CyberToys</strong>: a collection of utilities that
            I've built myself to deal with the everyday developer's challenges, inspired by the{" "}
            <Link href="https://devtoys.app/" target="_blank" rel="noopener noreferrer">
              DevToys
            </Link>
          </Text>
        </div>
        <div></div>
        <div className={css({ textAlign: "right", paddingTop: theme.spacing.m })}>
          <Link href="https://stefano.brilli.me/" target="_blank" rel="noopener noreferrer">
            Stefano
          </Link>
        </div>
      </div>
    </div>
  );
});

export default Home;
