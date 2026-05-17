import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Shield,
  Edit2,
  Trash2,
  Users,
  Lock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { roleApi } from "../api/roleApi";
import { toast } from "react-hot-toast";
import RoleModal from "../components/RoleModal";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";

export default function RoleListPage() {
  const { hasPermission } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await roleApi.getRoles();
      if (response.status === "Success") {
        const result = response.data;
        if (Array.isArray(result)) {
          setRoles(result);
        } else if (result && result.data && Array.isArray(result.data)) {
          setRoles(result.data);
        } else {
          setRoles([]);
        }
      }
    } catch (error) {
      if (error.response?.status === 403) {
        window.location.href = "/unauthorized";
      } else {
        toast.error("Failed to load roles");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddRole = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently remove this role and its access rights!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: document.documentElement.classList.contains("dark")
        ? "#1f2937"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff"
        : "#000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await roleApi.deleteRole(id);
          Swal.fire("Deleted!", "Role has been deleted.", "success");
          fetchRoles();
        } catch {
          Swal.fire("Error!", "Failed to delete role.", "error");
        }
      }
    });
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (role.permissions || []).some((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="pb-10 min-h-screen space-y-8">
      {/* Premium Sticky Header */}
      <div className="sticky top-4 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-6 rounded-md border border-gray-100/50 dark:border-gray-800/50 shadow-xl shadow-gray-500/5 transition-all mb-8">
        <div className="space-y-1 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-500" />
            </div>
            <span className="text-[10px] font-extrabold text-primary-500 uppercase tracking-[0.2em]">
              Enterprise System
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Access Roles
          </h1>
          <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            Security Permissions
          </p>
        </div>

        {/* Integrated Search Bar */}
        <div className="flex-1 max-w-lg mx-6 group relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Filter roles or permissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded text-xs font-bold outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="flex gap-6 pr-6 border-r border-gray-100 dark:border-gray-800">
            <div className="text-right">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Total Roles
              </p>
              <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">
                {roles.length}
              </p>
            </div>
          </div>
          {hasPermission("roles.create") && (
            <button
              onClick={handleAddRole}
              className="flex items-center gap-3 px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-md shadow-2xl shadow-primary-500/20 transition-all active:scale-95 group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Define Role
            </button>
          )}
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 animate-pulse flex flex-col justify-between min-h-[250px] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded"></div>
                  <div className="w-16 h-6 bg-gray-100 dark:bg-gray-800 rounded"></div>
                </div>
                <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/3 mb-6"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-50 dark:bg-gray-800 rounded w-16"></div>
                  <div className="h-6 bg-gray-50 dark:bg-gray-800 rounded w-16"></div>
                  <div className="h-6 bg-gray-50 dark:bg-gray-800 rounded w-16"></div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-24"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-12"></div>
              </div>
            </div>
          ))
        ) : filteredRoles.length > 0 ? (
          filteredRoles.map((role) => (
            <div
              key={role.id}
              className="group/card relative bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-300 flex flex-col justify-between min-h-[250px] h-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-primary-500/10 rounded flex items-center justify-center group-hover/card:bg-primary-500 transition-all duration-300">
                    <Shield className="w-6 h-6 text-primary-500 group-hover/card:text-white transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover/card:opacity-100 transition-all translate-x-4 group-hover/card:translate-x-0">
                    {hasPermission("roles.edit") && (
                      <button
                        onClick={() => handleEditRole(role)}
                        className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {hasPermission("roles.delete") && (
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tight mb-2">
                  {role.name}
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{role.permissions?.length || 0} Points Assigned</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {(role.permissions || []).slice(0, 4).map((perm) => (
                    <span
                      key={perm.id}
                      className="px-2 py-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-[9px] font-black rounded uppercase tracking-widest truncate max-w-[120px]"
                    >
                      {perm.name}
                    </span>
                  ))}
                  {role.permissions?.length > 4 && (
                    <span className="px-2 py-1 bg-primary-500/10 text-primary-500 text-[9px] font-black rounded uppercase tracking-widest border border-primary-500/20">
                      +{role.permissions.length - 4} More
                    </span>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between group-hover/card:bg-primary-500/5 transition-all">
                <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <Users className="w-4 h-4" />
                  <span>Security Role</span>
                </div>
                {hasPermission("roles.edit") && (
                  <button
                    onClick={() => handleEditRole(role)}
                    className="text-[10px] font-black text-primary-500 hover:text-primary-600 uppercase tracking-widest flex items-center gap-1 group/btn"
                  >
                    Manage
                    <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                )}
              </div>
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary-500/5 blur-3xl group-hover/card:bg-primary-500/10 transition-all rounded-full"></div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 shadow-sm">
            <Shield className="w-16 h-16 text-gray-100 dark:text-gray-800 mx-auto mb-4" />
            <h4 className="text-lg font-black text-gray-400 uppercase tracking-widest">
              No Roles Discovered
            </h4>
            <p className="text-xs text-gray-300 dark:text-gray-600 uppercase tracking-[0.2em] mt-2">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={selectedRole}
        onSuccess={fetchRoles}
      />
    </div>
  );
}
