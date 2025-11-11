const ACCESS_TOKEN_KEY = "accessToken";
const ROLE_KEY = "employeeRole";
const EMPLOYEE_KEY = "employeeProfile";

const isBrowser = () => typeof window !== "undefined";

export interface AuthSessionPayload<TEmployee = unknown> {
    accessToken: string;
    role?: string | null;
    employee?: TEmployee | null;
}

const saveAuth = <TEmployee = unknown>({
    accessToken,
    role,
    employee,
}: AuthSessionPayload<TEmployee>) => {
    if (!isBrowser()) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    if (role) {
        localStorage.setItem(ROLE_KEY, role);
    } else {
        localStorage.removeItem(ROLE_KEY);
    }

    if (employee) {
        localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employee));
    } else {
        localStorage.removeItem(EMPLOYEE_KEY);
    }
};

const clearAuth = () => {
    if (!isBrowser()) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(EMPLOYEE_KEY);
};

const getToken = (): string | null => {
    return isBrowser() ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
};

const getRole = (): string | null => {
    return isBrowser() ? localStorage.getItem(ROLE_KEY) : null;
};

const getEmployee = <TEmployee = unknown>(): TEmployee | null => {
    if (!isBrowser()) return null;
    const stored = localStorage.getItem(EMPLOYEE_KEY);
    if (!stored) return null;
    try {
        return JSON.parse(stored) as TEmployee;
    } catch {
        localStorage.removeItem(EMPLOYEE_KEY);
        return null;
    }
};

const isAuthenticated = (): boolean => Boolean(getToken());

export const authStorage = {
    save: saveAuth,
    clear: clearAuth,
    getToken,
    getRole,
    getEmployee,
    isAuthenticated,
};
