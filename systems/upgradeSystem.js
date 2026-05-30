// Click upgrade configurations - defines value ranges, probabilities, and costs
// Cost formula: min * 2 * 100 (where base is the minimum value at max chance)
// Progressive cost increase within each tier: 0.10, 0.20, 0.30, 0.40, 1.00
export const clickUpgrades = [
    { cost: 0, chance: 1.00, min: 1, max: 1 },
{ cost: 20, chance: 0.10, min: 1, max: 2 },
{ cost: 45, chance: 0.25, min: 1, max: 2 },
{ cost: 85, chance: 0.45, min: 1, max: 2 },
{ cost: 140, chance: 0.70, min: 1, max: 2 },
{ cost: 200, chance: 1.00, min: 1, max: 2 },

{ cost: 40, chance: 0.10, min: 2, max: 4 },
{ cost: 90, chance: 0.25, min: 2, max: 4 },
{ cost: 170, chance: 0.45, min: 2, max: 4 },
{ cost: 280, chance: 0.70, min: 2, max: 4 },
{ cost: 400, chance: 1.00, min: 2, max: 4 },

{ cost: 80, chance: 0.10, min: 4, max: 8 },
{ cost: 180, chance: 0.25, min: 4, max: 8 },
{ cost: 340, chance: 0.45, min: 4, max: 8 },
{ cost: 560, chance: 0.70, min: 4, max: 8 },
{ cost: 800, chance: 1.00, min: 4, max: 8 },

{ cost: 160, chance: 0.10, min: 8, max: 16 },
{ cost: 360, chance: 0.25, min: 8, max: 16 },
{ cost: 680, chance: 0.45, min: 8, max: 16 },
{ cost: 1120, chance: 0.70, min: 8, max: 16 },
{ cost: 1600, chance: 1.00, min: 8, max: 16 },

{ cost: 320, chance: 0.10, min: 16, max: 32 },
{ cost: 720, chance: 0.25, min: 16, max: 32 },
{ cost: 1360, chance: 0.45, min: 16, max: 32 },
{ cost: 2240, chance: 0.70, min: 16, max: 32 },
{ cost: 3200, chance: 1.00, min: 16, max: 32 },

{ cost: 640, chance: 0.10, min: 32, max: 64 },
{ cost: 1440, chance: 0.25, min: 32, max: 64 },
{ cost: 2720, chance: 0.45, min: 32, max: 64 },
{ cost: 4480, chance: 0.70, min: 32, max: 64 },
{ cost: 6400, chance: 1.00, min: 32, max: 64 },

{ cost: 1280, chance: 0.10, min: 64, max: 128 },
{ cost: 2880, chance: 0.25, min: 64, max: 128 },
{ cost: 5440, chance: 0.45, min: 64, max: 128 },
{ cost: 8960, chance: 0.70, min: 64, max: 128 },
{ cost: 12800, chance: 1.00, min: 64, max: 128 },

{ cost: 2560, chance: 0.10, min: 128, max: 256 },
{ cost: 5760, chance: 0.25, min: 128, max: 256 },
{ cost: 10880, chance: 0.45, min: 128, max: 256 },
{ cost: 17920, chance: 0.70, min: 128, max: 256 },
{ cost: 25600, chance: 1.00, min: 128, max: 256 },

{ cost: 5120, chance: 0.10, min: 256, max: 512 },
{ cost: 11520, chance: 0.25, min: 256, max: 512 },
{ cost: 21760, chance: 0.45, min: 256, max: 512 },
{ cost: 35840, chance: 0.70, min: 256, max: 512 },
{ cost: 51200, chance: 1.00, min: 256, max: 512 },

{ cost: 10240, chance: 0.10, min: 512, max: 1024 },
{ cost: 23040, chance: 0.25, min: 512, max: 1024 },
{ cost: 43520, chance: 0.45, min: 512, max: 1024 },
{ cost: 71680, chance: 0.70, min: 512, max: 1024 },
{ cost: 102400, chance: 1.00, min: 512, max: 1024 }
];

export const clickMultiplierLevels = [
    { mult: 2, cost: 450 },
    { mult: 3, cost: 700 },
    { mult: 4, cost: 950 },
    { mult: 5, cost: 1200 },
    { mult: 6, cost: 1450 },
    { mult: 7, cost: 1700 },
    { mult: 8, cost: 1950 },
    { mult: 9, cost: 2200 },
    { mult: 10, cost: 2450 }
];

export const employeeMultiplierLevels = [
    { mult: 1, cost: 0, unlockEmployees: 5 },
    { mult: 2, cost: 1000, unlockEmployees: 5 },
    { mult: 4, cost: 4000, unlockEmployees: 10 },
    { mult: 5, cost: 8000, unlockEmployees: 15 }
];

// Base cost for hiring the first employee
export const EMPLOYEE_BASE_COST = 100;

// Employee speed levels - delay in milliseconds between auto-clicks
export const employeeSpeedLevels = [
    { delay: 3000, cost: 0 },
    { delay: 2000, cost: 25 },
    { delay: 1500, cost: 50 },
    { delay: 1000, cost: 100 },
    { delay: 750, cost: 200 },
    { delay: 500, cost: 400 },
    { delay: 250, cost: 800 },
    { delay: 100, cost: 1600 },
    { delay: 75, cost: 3200 },
    { delay: 50, cost: 6400 },
    { delay: 25, cost: 12800 },
    { delay: 10, cost: 25600 },
    { delay: 7, cost: 51200 },
    { delay: 5, cost: 102400 },
    { delay: 1, cost: 409600 }
];