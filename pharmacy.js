const drugSpecificitiesMap = {
  "Herbal Tea": {
    getNextBenefit: (drug) => defaultGetNextBenefit(drug, -1), // get better with time, twice if expired
  },
  Fervex: {
    getNextBenefit: (drug) => {
      const { expiresIn, benefit } = drug;
      if (expiresIn <= 0) {
        return 0;
      }
      if (expiresIn <= 5) {
        return benefit + 3;
      }
      if (expiresIn <= 10) {
        return benefit + 2;
      }
    },
  },
  "Magic Pill": {
    getNextExpireIn: (drug) => drug.expiresIn, // never expire
    getNextBenefit: (drug) => drug.benefit, // don't degrade
  },
  Dafalgan: {
    getNextBenefit: (drug) => defaultGetNextBenefit(drug, 2),
  },
};

export class Drug {
  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }
}

export class Pharmacy {
  constructor(drugs = []) {
    this.drugs = drugs;
  }
  updateBenefitValue() {
    for (const [i, drug] of this.drugs.entries()) {
      // compute the new values
      let nextBenefit = defaultGetNextBenefit(drug, 1);
      let nextExpiresIn = defaultGetNextExpiresIn(drug);

      const specificities = drugSpecificitiesMap[drug.name];
      if (specificities) {
        if (specificities.getNextBenefit) {
          nextBenefit = specificities.getNextBenefit(drug);
        }
        if (specificities.getNextExpireIn) {
          nextExpiresIn = specificities.getNextExpireIn(drug);
        }
      }

      // update the values
      this.drugs[i].expiresIn = nextExpiresIn;
      this.drugs[i].benefit = limitBenefitToRange(nextBenefit);
    }
    return this.drugs;
  }
}

const defaultGetNextBenefit = (drug, dailyDegradation = 1) => {
  if (drug.expiresIn > 0) return drug.benefit - dailyDegradation;
  return drug.benefit - dailyDegradation * 2;
};

const defaultGetNextExpiresIn = (drug) => drug.expiresIn - 1;

const limitBenefitToRange = (benefit) => {
  if (benefit >= 50) return 50;
  if (benefit <= 0) return 0;
  return benefit;
};
