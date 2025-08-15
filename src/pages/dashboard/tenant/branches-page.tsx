import withAnimation from '@/components/base/route-animation/with-animation';
import { ListBranches } from '@/components/tenant/branches/list-branches';

export const BranchesPage = withAnimation(() => {
  return <ListBranches />;
});
