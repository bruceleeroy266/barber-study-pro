import { SchoolConfiguration, RolePermission, AppRole, Permission } from '@/types'
import { ALL_PERMISSIONS } from '@/lib/school-config'

interface Props {
  config: SchoolConfiguration
  onChange: (rolePermissions: RolePermission[]) => void
}

function togglePermission(
  rolePermissions: RolePermission[],
  role: AppRole,
  permission: Permission
): RolePermission[] {
  return rolePermissions.map((rp) => {
    if (rp.role !== role) return rp
    const has = rp.permissions.includes(permission)
    return {
      ...rp,
      permissions: has
        ? rp.permissions.filter((p) => p !== permission)
        : [...rp.permissions, permission],
    }
  })
}

export default function RolePermissionsSection({ config, onChange }: Props) {
  const { rolePermissions } = config

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Role & Permission Management</h2>
        <p className="text-sm text-gray-400">Configure what each role can do (demo-ready)</p>
      </div>

      <div className="space-y-6">
        {rolePermissions.map((rp) => (
          <div key={rp.role} className="bg-gray-950 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white font-medium capitalize">{rp.role}</span>
              <span className="text-xs text-gray-500">
                {rp.permissions.length} of {ALL_PERMISSIONS.length} permissions
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ALL_PERMISSIONS.map((perm) => {
                const checked = rp.permissions.includes(perm.value)
                return (
                  <label
                    key={perm.value}
                    className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onChange(togglePermission(rolePermissions, rp.role, perm.value))}
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                    {perm.label}
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
