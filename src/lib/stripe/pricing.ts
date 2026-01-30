export type ClassGroup = "adult" | "youth";
export type PackageKey = "intro_2" | "class_6" | "class_10" | "semester_16";

export type PriceDefinition = {
  amount: number;
  label: string;
  description?: string;
  priceIdEnv?: string;
};

export const pricingMap: Record<ClassGroup, Record<PackageKey, PriceDefinition>> = {
  adult: {
    intro_2: {
      amount: 4000,
      label: "Adult: 2 introductory classes",
      description: "Two introductory adult tabla classes",
      priceIdEnv: "STRIPE_PRICE_ADULT_INTRO_2"
    },
    class_6: {
      amount: 21000,
      label: "Adult: 6 classes",
      description: "Six adult tabla classes",
      priceIdEnv: "STRIPE_PRICE_ADULT_CLASS_6"
    },
    class_10: {
      amount: 28000,
      label: "Adult: 10 classes",
      description: "Ten adult tabla classes",
      priceIdEnv: "STRIPE_PRICE_ADULT_CLASS_10"
    },
    semester_16: {
      amount: 33750,
      label: "Adult: 16 class semester",
      description: "Sixteen adult tabla classes",
      priceIdEnv: "STRIPE_PRICE_ADULT_SEMESTER_16"
    }
  },
  youth: {
    intro_2: {
      amount: 2000,
      label: "Youth: 2 introductory classes",
      description: "Two introductory youth tabla classes",
      priceIdEnv: "STRIPE_PRICE_YOUTH_INTRO_2"
    },
    class_6: {
      amount: 0,
      label: "",
      description: ""
    },
    class_10: {
      amount: 0,
      label: "",
      description: ""
    },
    semester_16: {
      amount: 0,
      label: "",
      description: ""
    }
  }
};

export const adultPackages: PackageKey[] = ["intro_2", "class_6", "class_10", "semester_16"];
export const youthPackages: PackageKey[] = ["intro_2"];
