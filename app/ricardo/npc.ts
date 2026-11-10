class NPC {
  name: string;
  health: number[];
  speed: number;
  attack: number;
  defense: number;
  npcType: "Walk" | "Fly";

  constructor(
    name: string,
    health: number[],
    speed: number,
    attack: number,
    defense: number,
    npcType: "Walk" | "Fly",
  ) {
    this.name = name;
    this.health = health;
    this.speed = speed;
    this.attack = attack;
    this.defense = defense;
    this.npcType = npcType;
  }

  walking(): void {
    this.speed += 2;
    console.log(`${this.name} berjalan. Speed sekarang: ${this.speed}.`);
  }

  sprint(): void {
    this.speed += 4;
    console.log(`${this.name} berlari. Speed sekarang: ${this.speed}.`);
  }

  attacking(): void {
    this.attack += 2;
    console.log(`${this.name} menyerang. Attack sekarang: ${this.attack}.`);
  }
}

const goblin = new NPC("Goblin", [100], 5, 10, 3, "Walk");

goblin.walking();   // Goblin berjalan. Speed sekarang: 7.
goblin.sprint();    // Goblin berlari. Speed sekarang: 11.
goblin.attacking(); // Goblin menyerang. Attack sekarang: 12.