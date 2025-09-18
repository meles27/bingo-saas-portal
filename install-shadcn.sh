
# Script to install multiple shadcn components in a Linux/macOS environment.

# --- Color Codes for Terminal Output ---
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# --- List of components to install ---
# The list is based on the official shadcn documentation.
# 'sidebar' and 'typography' are not installable components.
# 'chart' has been updated to 'charts'.
components=(
    "accordion"
    "alert"
    "alert-dialog"
    "aspect-ratio"
    "avatar"
    "badge"
    "breadcrumb"
    "button"
    "calendar"
    "card"
    "carousel"
    "chart"            # Installs the charting library
    "checkbox"
    "collapsible"
    "command"
    "context-menu"
    "date-picker"
    "dialog"
    "drawer"
    "dropdown-menu"
    "form"              # Corresponds to React Hook Form
    "hover-card"
    "input"
    "input-otp"
    "label"
    "menubar"
    "navigation-menu"
    "pagination"
    "popover"
    "progress"
    "radio-group"
    "resizable"
    "scroll-area"
    "select"
    "separator"
    "sheet"
    "skeleton"
    "slider"
    "sonner"            # Toast notifications
    "switch"
    "table"
    "tabs"
    "textarea"
    "toggle"
    "toggle-group"
    "tooltip"
)

# Array to store any errors encountered
errors_encountered=()

echo -e "${GREEN}Starting shadcn component installation...${NC}"
echo -e "${YELLOW}IMPORTANT:${NC} This script assumes you are in your project's root directory and have run 'npx shadcn@latest init'."
echo "You may need to respond to interactive prompts from 'npx shadcn@latest add'."
echo "---------------------------------------------------------------------"

# Loop through each component in the array
for component in "${components[@]}"; do
    echo ""
    echo -e "Attempting to add component: ${YELLOW}${component}${NC}..."

    # Execute the npx command. The '-y' flag attempts to auto-confirm prompts,
    # though shadcn might still ask for confirmation on overwrites.
    npx shadcn@latest add "$component"

    # Check the exit code of the last command
    # $? holds the exit status of the most recently executed command. 0 means success.
    if [ $? -ne 0 ]; then
        error_message="Error adding component '${component}'. npx exited with a non-zero status. Check output above for details."
        echo -e "${RED}${error_message}${NC}"
        # Add the error message to our array of errors
        errors_encountered+=("$error_message")
    else
        echo -e "${GREEN}Successfully processed ${component}.${NC}"
    fi
done

echo ""
echo "---------------------------------------------------------------------"
echo "Component installation process finished."

# Check if the errors array has any elements
if [ ${#errors_encountered[@]} -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}The following errors occurred during the installation process:${NC}"
    # Loop through and print all the recorded errors
    for err in "${errors_encountered[@]}"; do
        echo -e "${RED}- ${err}${NC}"
    done
    echo -e "${YELLOW}Please review the errors above and address them manually.${NC}"
else
    echo -e "${GREEN}All specified components were processed successfully.${NC}"
    echo -e "${GREEN}If no warnings/errors were shown, all components should be added correctly.${NC}"
fi

# Reminder
echo ""
echo "Remember to check your project for any uncommitted changes after running this script."