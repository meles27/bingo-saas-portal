import SelectRole from '@/components/base/auth/select-roles';
import { SelectUser } from '@/components/base/auth/select-user';
import { JsonViewer } from '@/components/base/json-viewer';
import { useState } from 'react';

export const TestPage = () => {
  const [roleId, setRoleId] = useState([
    '4ba60d54-7c7a-43a1-8c70-60b81d576df0'
  ]);
  return (
    <div className="flex flex-col w-full h-full min-h-[80vh] items-center justify-center">
      <SelectRole
        label="Select Role"
        className="border-red-500 min-w-80 border"
        value={roleId}
        onChange={(roleId) => setRoleId(roleId)}
      />
      <JsonViewer data={roleId} />
      <UserProfileForm />
      <AssignTaskForm />
    </div>
  );
};

// --- Parent Component Example ---

function UserProfileForm() {
  // 1. State is initialized with a default role ID.
  //    This could come from an API response for an existing user, for example.
  const [selectedRoleId, setSelectedRoleId] = useState<string[] | undefined>(
    ['role-id-from-database-123'] // <-- Your "default" roleId
  );

  return (
    <div>
      <h3 className="mb-4">Assign Role</h3>
      <SelectRole
        label="User Role"
        // 2. The current state is passed as the `value`.
        value={selectedRoleId}
        // 3. The state updater function is passed to `onChange`.
        onChange={(newRoleId) => setSelectedRoleId(newRoleId)}
      />
      <p className="mt-4">Selected Role ID: {selectedRoleId || 'None'}</p>
    </div>
  );
}

function AssignTaskForm() {
  const [assignedUserId, setAssignedUserId] = useState<string | undefined>(
    'user-id-from-database-abc' // Pre-select a user if needed
  );

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Assign Task To User</h3>
      <SelectUser
        label="Assignee"
        value={assignedUserId}
        onChange={(newUserId) => setAssignedUserId(newUserId)}
      />
      <p className="mt-4 text-sm">
        Selected User ID: {assignedUserId || 'None'}
      </p>
    </div>
  );
}
