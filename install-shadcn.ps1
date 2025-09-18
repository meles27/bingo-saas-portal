# Script to install multiple shadcn-ui components

# --- List of components to install ---
# The list is based on the official shadcn documentation.
# 'sidebar' and 'typography' are not installable components.
# 'chart' has been updated to 'charts'.
components=@(
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
$errorsEncountered = @()

Write-Host "Starting shadcn@latest component installation..."
Write-Host "IMPORTANT: This script assumes you are in your project's root directory and have run 'npx shadcn-ui init'."
Write-Host "You may need to respond to interactive prompts from 'npx shadcn add'."
Write-Host "---------------------------------------------------------------------"

foreach ($component in $components) {
    Write-Host ""
    Write-Host "Attempting to add component: $component..."
    try {
        # Execute the npx command
        # The '&' (call operator) is generally not needed if npx is in PATH and first token.
        # Invoke-Expression could be used but is less safe. Direct call is preferred.
        npx shadcn@latest add $component --overwrite

        # Check the exit code of the last command
        if ($LASTEXITCODE -ne 0) {
            # npx might not throw a terminating error PowerShell's try/catch always catches,
            # so we check $LASTEXITCODE.
            # We'll construct a custom error message.
            $errorMessage = "Error adding component '$component'. npx exited with code $LASTEXITCODE. Check output above for details."
            Write-Warning $errorMessage
            $errorsEncountered += $errorMessage
            # Note: If npx outputs detailed errors to stderr, they might appear before this warning.
        } else {
            Write-Host "Successfully added $component." -ForegroundColor Green
        }
    } catch {
        # This catch block will handle PowerShell-level errors (e.g., npx not found)
        # or if npx throws an error that PowerShell's try/catch can intercept.
        $errorMessage = "An exception occurred while trying to add component '$component': $($_.Exception.Message)"
        Write-Warning $errorMessage
        $errorsEncountered += $errorMessage
    }
}

Write-Host ""
Write-Host "---------------------------------------------------------------------"
Write-Host "Component installation process finished."

if ($errorsEncountered.Count -gt 0) {
    Write-Host ""
    Write-Host "The following errors occurred during the installation process:" -ForegroundColor Yellow
    foreach ($err in $errorsEncountered) {
        Write-Error $err # Write-Error prints to the error stream, making it more prominent
    }
    Write-Host "Please review the errors above and address them manually." -ForegroundColor Yellow
} else {
    Write-Host "All specified components were processed. Check output above for any individual non-terminating npx errors." -ForegroundColor Green
    Write-Host "If no warnings/errors were shown during the process, all components should be added successfully." -ForegroundColor Green
}

# Reminder
Write-Host ""
Write-Host "Remember to check your project for any uncommitted changes after running this script."