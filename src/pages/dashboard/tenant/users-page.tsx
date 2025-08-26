import withAnimation from '@/components/base/route-animation/with-animation';
import { UserList } from '@/components/tenant/users/user-list';

export const UsersPage = withAnimation(() => {
  return (
    <>
      <UserList />
    </>
  );
});
