// Click upgrade configurations - defines value ranges, probabilities, and costs
// Cost formula: min * 2 * 100 (where base is the minimum value at max chance)
// Progressive cost increase within each tier: 0.10, 0.20, 0.30, 0.40, 1.00
export const clickUpgrades = [
    { cost: 0, chance: 1.00, min: 1, max: 1 },
{ cost: 40, chance: 0.10, min: 1, max: 2 },
{ cost: 80, chance: 0.20, min: 1, max: 2 },
{ cost: 120, chance: 0.30, min: 1, max: 2 },
{ cost: 160, chance: 0.40, min: 1, max: 2 },
{ cost: 200, chance: 0.50, min: 1, max: 2 },
{ cost: 240, chance: 0.60, min: 1, max: 2 },
{ cost: 280, chance: 0.70, min: 1, max: 2 },
{ cost: 320, chance: 0.80, min: 1, max: 2 },
{ cost: 360, chance: 0.90, min: 1, max: 2 },
{ cost: 400, chance: 1.00, min: 1, max: 2 },

{ cost: 440, chance: 0.10, min: 2, max: 4 },
{ cost: 480, chance: 0.20, min: 2, max: 4 },
{ cost: 520, chance: 0.30, min: 2, max: 4 },
{ cost: 560, chance: 0.40, min: 2, max: 4 },
{ cost: 600, chance: 0.50, min: 2, max: 4 },
{ cost: 640, chance: 0.60, min: 2, max: 4 },
{ cost: 680, chance: 0.70, min: 2, max: 4 },
{ cost: 720, chance: 0.80, min: 2, max: 4 },
{ cost: 760, chance: 0.90, min: 2, max: 4 },
{ cost: 800, chance: 1.00, min: 2, max: 4 },

{ cost: 880, chance: 0.10, min: 4, max: 8 },
{ cost: 960, chance: 0.20, min: 4, max: 8 },
{ cost: 1040, chance: 0.30, min: 4, max: 8 },
{ cost: 1120, chance: 0.40, min: 4, max: 8 },
{ cost: 1200, chance: 0.50, min: 4, max: 8 },
{ cost: 1280, chance: 0.60, min: 4, max: 8 },
{ cost: 1360, chance: 0.70, min: 4, max: 8 },
{ cost: 1440, chance: 0.80, min: 4, max: 8 },
{ cost: 1520, chance: 0.90, min: 4, max: 8 },
{ cost: 1600, chance: 1.00, min: 4, max: 8 },

{ cost: 1760, chance: 0.10, min: 8, max: 16 },
{ cost: 1920, chance: 0.20, min: 8, max: 16 },
{ cost: 2080, chance: 0.30, min: 8, max: 16 },
{ cost: 2240, chance: 0.40, min: 8, max: 16 },
{ cost: 2400, chance: 0.50, min: 8, max: 16 },
{ cost: 2560, chance: 0.60, min: 8, max: 16 },
{ cost: 2720, chance: 0.70, min: 8, max: 16 },
{ cost: 2880, chance: 0.80, min: 8, max: 16 },
{ cost: 3040, chance: 0.90, min: 8, max: 16 },
{ cost: 3200, chance: 1.00, min: 8, max: 16 },

{ cost: 3520, chance: 0.10, min: 16, max: 32 },
{ cost: 3840, chance: 0.20, min: 16, max: 32 },
{ cost: 4160, chance: 0.30, min: 16, max: 32 },
{ cost: 4480, chance: 0.40, min: 16, max: 32 },
{ cost: 4800, chance: 0.50, min: 16, max: 32 },
{ cost: 5120, chance: 0.60, min: 16, max: 32 },
{ cost: 5440, chance: 0.70, min: 16, max: 32 },
{ cost: 5760, chance: 0.80, min: 16, max: 32 },
{ cost: 6080, chance: 0.90, min: 16, max: 32 },
{ cost: 6400, chance: 1.00, min: 16, max: 32 },

{ cost: 7040, chance: 0.10, min: 32, max: 64 },
{ cost: 7680, chance: 0.20, min: 32, max: 64 },
{ cost: 8320, chance: 0.30, min: 32, max: 64 },
{ cost: 8960, chance: 0.40, min: 32, max: 64 },
{ cost: 9600, chance: 0.50, min: 32, max: 64 },
{ cost: 10240, chance: 0.60, min: 32, max: 64 },
{ cost: 10880, chance: 0.70, min: 32, max: 64 },
{ cost: 11520, chance: 0.80, min: 32, max: 64 },
{ cost: 12160, chance: 0.90, min: 32, max: 64 },
{ cost: 12800, chance: 1.00, min: 32, max: 64 },

{ cost: 14080, chance: 0.10, min: 64, max: 128 },
{ cost: 15360, chance: 0.20, min: 64, max: 128 },
{ cost: 16640, chance: 0.30, min: 64, max: 128 },
{ cost: 17920, chance: 0.40, min: 64, max: 128 },
{ cost: 19200, chance: 0.50, min: 64, max: 128 },
{ cost: 20480, chance: 0.60, min: 64, max: 128 },
{ cost: 21760, chance: 0.70, min: 64, max: 128 },
{ cost: 23040, chance: 0.80, min: 64, max: 128 },
{ cost: 24320, chance: 0.90, min: 64, max: 128 },
{ cost: 25600, chance: 1.00, min: 64, max: 128 },

{ cost: 28160, chance: 0.10, min: 128, max: 256 },
{ cost: 30720, chance: 0.20, min: 128, max: 256 },
{ cost: 33280, chance: 0.30, min: 128, max: 256 },
{ cost: 35840, chance: 0.40, min: 128, max: 256 },
{ cost: 38400, chance: 0.50, min: 128, max: 256 },
{ cost: 40960, chance: 0.60, min: 128, max: 256 },
{ cost: 43520, chance: 0.70, min: 128, max: 256 },
{ cost: 46080, chance: 0.80, min: 128, max: 256 },
{ cost: 48640, chance: 0.90, min: 128, max: 256 },
{ cost: 51200, chance: 1.00, min: 128, max: 256 },

{ cost: 56320, chance: 0.10, min: 256, max: 512 },
{ cost: 61440, chance: 0.20, min: 256, max: 512 },
{ cost: 66560, chance: 0.30, min: 256, max: 512 },
{ cost: 71680, chance: 0.40, min: 256, max: 512 },
{ cost: 76800, chance: 0.50, min: 256, max: 512 },
{ cost: 81920, chance: 0.60, min: 256, max: 512 },
{ cost: 87040, chance: 0.70, min: 256, max: 512 },
{ cost: 92160, chance: 0.80, min: 256, max: 512 },
{ cost: 97280, chance: 0.90, min: 256, max: 512 },
{ cost: 102400, chance: 1.00, min: 256, max: 512 },

{ cost: 112640, chance: 0.10, min: 512, max: 1024 },
{ cost: 122880, chance: 0.20, min: 512, max: 1024 },
{ cost: 133120, chance: 0.30, min: 512, max: 1024 },
{ cost: 143360, chance: 0.40, min: 512, max: 1024 },
{ cost: 153600, chance: 0.50, min: 512, max: 1024 },
{ cost: 163840, chance: 0.60, min: 512, max: 1024 },
{ cost: 174080, chance: 0.70, min: 512, max: 1024 },
{ cost: 184320, chance: 0.80, min: 512, max: 1024 },
{ cost: 194560, chance: 0.90, min: 512, max: 1024 },
{ cost: 204800, chance: 1.00, min: 512, max: 1024 }
];

export const clickMultiplierLevels = [
    { mult: 2, cost: 900 },
    { mult: 3, cost: 1400 },
    { mult: 4, cost: 1900 },
    { mult: 5, cost: 2400 },
    { mult: 6, cost: 2900 },
    { mult: 7, cost: 3400 },
    { mult: 8, cost: 3900 },
    { mult: 9, cost: 4400 },
    { mult: 10, cost: 4900 }
];

export const employeeMultiplierLevels = [
    { mult: 1, cost: 0, unlockEmployees: 5 },
    { mult: 2, cost: 2000, unlockEmployees: 5 },
    { mult: 4, cost: 8000, unlockEmployees: 10 },
    { mult: 5, cost: 16000, unlockEmployees: 15 }
];

// Base cost for hiring the first employee
export const EMPLOYEE_BASE_COST = 300;

// Employee speed levels - delay in milliseconds between auto-clicks
export const employeeSpeedLevels = [
    { delay: 3000, cost: 0 },
    { delay: 2000, cost: 50 },
    { delay: 1500, cost: 100 },
    { delay: 1000, cost: 200 },
    { delay: 750, cost: 400 },
    { delay: 500, cost: 800 },
    { delay: 250, cost: 1600 },
    { delay: 100, cost: 3200 },
    { delay: 75, cost: 6400 },
    { delay: 50, cost: 12800 },
    { delay: 25, cost: 25600 },
    { delay: 10, cost: 51200 },
    { delay: 7, cost: 102400 },
    { delay: 5, cost: 204800 },
    { delay: 1, cost: 819200 }
];