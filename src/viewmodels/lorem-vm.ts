import { makeAutoObservable, createAtom } from "mobx";
import { AppContext } from "../shared";
import { LoremIpsum } from "lorem-ipsum";
import MersenneTwister from "mersenne-twister";

const standard: string[] = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?`,
  `At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.`,
];

export class LoremVM {
  wordsPerSentence: [number, number] = [6, 8];
  sentencesPerParagraph: [number, number] = [6, 10];
  paragraphs: number = 1;
  randomGenerator = new MersenneTwister(42);

  type: string = "standard";
  count: number = 1;
  regenerateAtom = createAtom("regenerateAtom");

  constructor(public context: AppContext) {
    makeAutoObservable(this);
  }

  setType(val: string) {
    this.type = val;
  }

  setCount(val: number) {
    this.count = val;
  }

  regenerate() {
    this.regenerateAtom.reportChanged();
  }

  get text() {
    try {
      const loremGenerator = new LoremIpsum({
        random: () => this.randomGenerator.random(),
        sentencesPerParagraph: {
          min: this.sentencesPerParagraph[0],
          max: this.sentencesPerParagraph[1],
        },
        wordsPerSentence: {
          min: this.wordsPerSentence[0],
          max: this.wordsPerSentence[1],
        },
      });
      this.regenerateAtom.reportObserved();
      if (this.type === "paragraphs") {
        return loremGenerator.generateParagraphs(this.count);
      } else if (this.type === "sentences") {
        return loremGenerator.generateSentences(this.count);
      } else if (this.type === "words") {
        return loremGenerator.generateWords(this.count);
      } else {
        // standard
        let res = ``;
        for (let i = 0; i < this.count; i++) {
          res = res + standard[i % standard.length] + `\n`;
        }
        return res;
      }
    } catch (err) {
      console.error(err);
      return "";
    }
  }

  serialize() {
    return { type: this.type, count: this.count };
  }

  deserialize(data: any) {
    if (!data) {
      return;
    }
    this.setType(data.type);
    this.setCount(data.count);
  }
}
