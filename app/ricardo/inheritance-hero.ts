// class Hero {
//   hp: number;
//   lvl: number;
//   speed: number;
//   attackPower: number;
//   attackSpeed: number;
//   physicalDefense: number;
//   magicalDefense: number;
//   distance: number;

//   constructor(hp: number, lvl: number, speed: number, attackPower: number, attackSpeed: number, physicalDefense: number, magicalDefense: number, distance: number) {
//     this.hp = hp;
//     this.lvl = lvl;
//     this.speed = speed;
//     this.attackPower = attackPower;
//     this.attackSpeed = attackSpeed;
//     this.physicalDefense = physicalDefense;
//     this.magicalDefense = magicalDefense;
//     this.distance = distance;
//   }

//   firstSkill(): string {
//     return "this is first skill in general";
//   }
//   secondSkill() {}
//   ultimateSkill() {}
// }

// class Marksman extends Hero {
//   constructor(hp: number) {
//     super(hp, 1, 10, 30, 1, 10, 10, 5);
//   }

//   firstSkill(): string {
//     return "this is first skill in Marksman";
//   }
// }

// class Miya extends Marksman {
//   constructor() {
//     super(2250);
//   }

//   firstSkill(): string {
//     return "this is first skill in Miya";
//   }
// }

// class Layla extends Marksman {
//   constructor() {
//     super(3350);
//   }

//   firstSkill(): string {
//     return "this is first skill in Layla";
//   }
// }

// class Jungler extends Hero {
//   constructor() {
//     super(1000, 1, 10, 30, 1, 10, 10, 5);
//   }
// }

// class Mage extends Hero {
//   magicDamage: number = 10;
// }

// class Fighter extends Hero {
//   physicalDamage: number = 10;
//   spellVamp: number = 10;
// }

// class Yuzhong extends Fighter {
//   thirdSkill(): string {
//     return "this is 3rd skill in Yuzhong";
//   }
// }

// class Tank extends Hero {
    
// }

// class Support extends Hero {
//   healingPower: number = 10;
// }

// const miya = new Miya();
// const layla = new Layla();
// const yuzhong = new Yuzhong(3000, 1, 10, 30, 1, 10, 10, 5);

// console.log(miya.firstSkill());
// console.log(layla.firstSkill());
// console.log(yuzhong.thirdSkill());

// =====================================================================
//  SOAL: Mario Bros dengan OOP (TypeScript)
// =====================================================================
//  Mario memiliki atribut: HP, speed, positionX, positionY, invincible,
//  currentForm. Mario dapat berubah menjadi 3 form: 'mario',
//  'super mario', dan 'fire mario'.
//
//  Default: HP = 1, speed = 5, currentForm = 'mario', invincible = false,
//           positionX = 0, positionY = 0
//
//  1. SuperMushroom (Jamur): Mario menjadi Super Mario, HP + 1.
//  2. FireFlower (Bunga): Mario menjadi Fire Mario, HP + 1,
//     dan dapat menembakkan bola api.
//  3. SuperStar (Bintang): Mario kebal terhadap serangan.
//  4. Diserang: HP - 1 dan kembali ke form 'mario'.
//     Jika sedang kebal, serangan tidak berpengaruh.
//  5. Bergerak ke kanan: positionX + speed.
//  6. Bergerak ke kiri: positionX - speed.
//
//  Buat class, attribute, method, dan object.
//  Terapkan inheritance dan polymorphism.
// =====================================================================

// Kerjakan Quiznya Disini
type MarioForm = "mario" | "super mario" | "fire mario";

class Mario {
  hp: number;
  speed: number;
  positionX: number;
  positionY: number;
  invincible: boolean;
  currentForm: MarioForm;

  constructor(
    hp: number = 1,
    speed: number = 5,
    positionX: number = 0,
    positionY: number = 0,
    invincible: boolean = false,
    currentForm: MarioForm  = "mario"
  ) {
    this.hp = hp;
    this.speed = speed;
    this.positionX = positionX;
    this.positionY = positionY;
    this.invincible = invincible;
    this.currentForm = currentForm;
  }

  moveRight(): void {
    this.positionX += this.speed;
    console.log(`Mario pindah ke kanan. posisiX: ${this.positionX}`);
  }

  moveLeft(): void {
    this.positionX -= this.speed;
    console.log(`Mario pindah ke kiri. posisiX: ${this.positionX}`);
  }

  getSuperMushroom(): void {
    this.currentForm = "super mario";
    this.hp += 1;
    console.log(`Mario menjadi ${this.currentForm}. hp sekarang: ${this.hp}`);
  }

  getFireFlower(): void {
    this.currentForm = "fire mario";
    this.hp += 1;
    console.log(`Mario menjadi ${this.currentForm}. hp sekarang: ${this.hp}`);
  }

  getSuperStar(): void {
    this.invincible = true;
    console.log("Mario mendapat Super Star. Mario kebal!");
  }

  endInvincible(): void {
    this.invincible = false;
    console.log("Efek Super Star habis. Mario tidak kebal lagi.");
  }

  getAttacked(): void {
    if (this.invincible) {
      console.log("Mario diserang tapi kebal. Tidak ada efek.");
      return;
    }
    this.hp = Math.max(0, this.hp - 1);
    this.currentForm = "mario";
    console.log(`Mario diserang! hp sekarang: ${this.hp}, form: ${this.currentForm}`);
    if (this.hp === 0) console.log("Game Over!");
  }

  shootFireball(): void {
    if (this.currentForm === "fire mario") {
      console.log(`Mario menembakkan bola api dari posisiX: ${this.positionX}`);
    } else {
      console.log("Mario tidak bisa menembak, butuh Fire Flower.");
    }
  }

  getStatus(): void {
    console.log(
      `[STATUS] form: ${this.currentForm} | hp: ${this.hp} | kebal: ${this.invincible} | posisiX: ${this.positionX}`
    );
  }
}

// ---------- Inheritance: Item (abstract class) ----------
abstract class Item {
  constructor(public name: string) {}

  // Polymorphism: tiap turunan punya implementasi sendiri
  abstract applyTo(mario: Mario): void;
}

class SuperMushroom extends Item {
  constructor() {
    super("SuperMushroom (Jamur)");
  }
  applyTo(mario: Mario): void {
    mario.getSuperMushroom();
  }
}

class FireFlower extends Item {
  constructor() {
    super("FireFlower (Bunga)");
  }
  applyTo(mario: Mario): void {
    mario.getFireFlower();
  }
}

class SuperStar extends Item {
  constructor() {
    super("SuperStar (Bintang)");
  }
  applyTo(mario: Mario): void {
    mario.getSuperStar();
  }
}

// ---------- Object / Demo ----------
const mario = new Mario();
mario.getStatus();

mario.moveRight();
mario.moveRight();
mario.moveLeft();

const items: Item[] = [new SuperMushroom(), new FireFlower(), new SuperStar()];

for (const item of items) {
  console.log(`\nMario mengambil ${item.name}`);
  item.applyTo(mario); // polymorphism
  mario.getStatus();
}

mario.shootFireball();   // fire mario -> bisa menembak
mario.getAttacked();     // kebal -> tidak ada efek
mario.endInvincible();
mario.getAttacked();     // hp -1, kembali ke form mario
mario.shootFireball();   // sudah bukan fire mario
mario.getStatus();