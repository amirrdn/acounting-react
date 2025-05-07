import { Role, ROLES } from '../constants/roles';
import { useAuthStore } from '../store/authStore';

export const useRole = () => {
  const { user } = useAuthStore();

  const hasRole = (roles: Role | Role[]): boolean => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  return {
    hasRole,
    isAdmin: hasRole(ROLES.admin),
    isSales: hasRole(ROLES.sales),
    isPurchase: hasRole(ROLES.purchase),
    isAccounting: hasRole(ROLES.accounting),
    isInventory: hasRole(ROLES.inventory),
    isCashier: hasRole(ROLES.cashier),
    isManager: hasRole(ROLES.manager),
  };
};