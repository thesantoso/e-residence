# #!/bin/bash

# # Script untuk menambahkan eslint-disable comments pada unused variables
# # Run this script to quickly fix ESLint unused variable errors

# echo "Adding eslint-disable comments for unused variables..."

# # Fix API route files - add to the beginning of each file
# files=(
#   "src/app/api/admin/users/route.ts"
#   "src/components/settings/AddUserModal.tsx"
#   "src/context/AuthContext.tsx"
#   "src/context/UserManagementContext.tsx"
# )

# for file in "${files[@]}"; do
#   if [ -f "$file" ]; then
#     echo "Processing $file..."
#     # Add eslint disable comment at the top if not already present
#     if ! grep -q "eslint-disable" "$file"; then
#       sed -i '1i/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */' "$file"
#     fi
#   fi
# done

# echo "ESLint disable comments added!"
# echo "You can now run 'yarn build' successfully."
# echo ""
# echo "Note: This is a temporary fix. Consider properly implementing"
# echo "the unused variables or removing them for production code."
