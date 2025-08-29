export const COUNTRIES = {
  KENYA: "KENYA",
  TANZANIA: "TANZANIA",
  UGANDA: "UGANDA",
  RWANDA: "RWANDA",
};

export const ROLES = {
  SUPER_ADMIN: "Super Admin",
  COMPANY_ADMIN: "Company Admin",
  MANAGER: "Manager",
  EMPLOYEE: "Employee",
  APPROVER: "Approver",
  GUEST: "Guest",
};

function createRoleKeys<T extends Record<string, string>>(roles: T) {
  return Object.keys(roles).reduce(
    (acc, key) => {
      acc[key as keyof T] = key;
      return acc;
    },
    {} as { [K in keyof T]: K }
  );
}

export const ROLES_KEYS = createRoleKeys(ROLES);
