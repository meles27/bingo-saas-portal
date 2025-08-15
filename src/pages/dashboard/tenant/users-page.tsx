import withAnimation from '@/components/base/route-animation/with-animation';
import { ListUsers } from '@/components/tenant/users/list-users';

export const UsersPage = withAnimation(() => {
  return (
    <>
      <ListUsers />
    </>
  );
});
