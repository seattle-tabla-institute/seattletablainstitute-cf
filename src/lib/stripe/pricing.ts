export type ClassGroup = "adult" | "youth";
export type PackageKey = "intro_2" | "half_semester" | "semester_16";

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
    half_semester: {
      amount: 24000,
      label: "Adult: Half semester",
      description: "Half semester of adult tabla classes",
      priceIdEnv: "STRIPE_PRICE_ADULT_HALF_SEMESTER"
    },
    semester_16: {
      amount: 33750,
      label: "Adult: Full semester",
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
    }
  }
};

export const adultPackages: PackageKey[] = ["intro_2", "half_semester", "semester_16"];
export const youthPackages: PackageKey[] = ["intro_2"];
