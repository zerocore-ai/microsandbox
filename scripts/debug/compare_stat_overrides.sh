#!/bin/bash

# Script to compare actual file stats with override stats from xattrs
#
# Usage: ./compare_stat_overrides.sh [-L level] <directory>
#
# Description:
#   This script displays the actual file stat (uid:gid:mode) alongside the
#   user.containers.override_stat xattr value if present. This allows easy
#   comparison between the real file permissions and the virtualized ones.
#
# Options:
#   -L level      Descend only level directories deep (like tree -L)
#   -a            Show all files including hidden files
#   -h, --help    Show help message
#
# Examples:
#   ./compare_stat_overrides.sh .                    # Compare stats in current directory (all depths)
#   ./compare_stat_overrides.sh -L 2 /home/user      # Compare stats up to 2 levels deep
#   ./compare_stat_overrides.sh -L 1 -a ~/           # Compare stats 1 level deep, including hidden files
#
# Notes:
#   - Requires 'xattr' command to be available on the system
#   - On macOS, xattr is built-in
#   - On Linux, you may need to install 'attr' package

# Default values
MAX_DEPTH=""
SHOW_HIDDEN=false
DIR=""
TOTAL_COUNT=0

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -L)
            if [[ -z "$2" ]] || ! [[ "$2" =~ ^[0-9]+$ ]]; then
                echo "Error: -L requires a numeric level argument"
                exit 1
            fi
            MAX_DEPTH="$2"
            shift 2
            ;;
        -a)
            SHOW_HIDDEN=true
            shift
            ;;
        -h|--help)
            echo "compare_stat_overrides.sh - Compare actual file stats with override stats from xattrs"
            echo ""
            echo "Usage: $0 [-L level] [-a] <directory>"
            echo ""
            echo "Options:"
            echo "  -L level      Descend only level directories deep"
            echo "  -a            Show all files including hidden files"
            echo "  -h, --help    Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 .                    # Current directory, all depths"
            echo "  $0 -L 2 /home/user      # Up to 2 levels deep"
            echo "  $0 -L 1 -a ~/           # 1 level deep, include hidden files"
            exit 0
            ;;
        *)
            if [[ -z "$DIR" ]]; then
                DIR="$1"
            else
                echo "Error: Too many arguments"
                echo "Usage: $0 [-L level] [-a] <directory>"
                exit 1
            fi
            shift
            ;;
    esac
done

# Check if directory argument is provided
if [[ -z "$DIR" ]]; then
    echo "Error: No directory specified"
    echo "Usage: $0 [-L level] [-a] <directory>"
    echo "Try '$0 --help' for more information."
    exit 1
fi

# Check if directory exists
if [ ! -d "$DIR" ]; then
    echo "Error: Directory '$DIR' does not exist"
    exit 1
fi

# Function to print tree-like indentation
print_indent() {
    local level=$1
    local is_last=$2
    local prefix=""
    
    for ((i=0; i<level; i++)); do
        if [ $i -eq $((level-1)) ]; then
            if [ "$is_last" = "true" ]; then
                prefix="${prefix}└── "
            else
                prefix="${prefix}├── "
            fi
        else
            prefix="${prefix}│   "
        fi
    done
    
    echo -n "$prefix"
}

# Function to display stat comparison for a file with tree formatting
show_stat_comparison() {
    local file="$1"
    local level="$2"
    local is_last="$3"
    local basename=$(basename "$file")
    
    # Skip hidden files if -a flag not set
    if [ "$SHOW_HIDDEN" = false ] && [[ "$basename" == .* ]] && [ "$level" -gt 0 ]; then
        return
    fi
    
    # Get actual file stat in uid:gid:mode format
    local actual_stat=$(stat -c "%u:%g:%04a" "$file" 2>/dev/null)
    if [ -d "$file" ] && [ -n "$actual_stat" ]; then
        # Prepend file type bits to mode for directories
        local mode=$(stat -c "%04a" "$file")
        local uid=$(stat -c "%u" "$file")
        local gid=$(stat -c "%g" "$file")
        actual_stat="${uid}:${gid}:04${mode}"
    fi
    
    # Get override stat from xattr
    local override_stat=$(xattr -p user.containers.override_stat "$file" 2>/dev/null | tr -d '\n')
    
    # Only show files that have either stat info or override stat
    if [ -z "$actual_stat" ] && [ -z "$override_stat" ]; then
        return
    fi
    
    # Print the file/directory name with tree formatting
    if [ $level -gt 0 ]; then
        print_indent $level "$is_last"
    fi
    
    # Format the output with actual vs override stat
    local name_part=""
    if [ -d "$file" ]; then
        name_part="\033[1;34m${basename}/\033[0m"
    else
        name_part="$basename"
    fi
    
    # Build stat comparison string
    local stat_part=""
    if [ -n "$actual_stat" ] && [ -n "$override_stat" ]; then
        if [ "$actual_stat" = "$override_stat" ]; then
            stat_part=" [${actual_stat}]"
        else
            stat_part=" [\033[33m${actual_stat}\033[0m → \033[32m${override_stat}\033[0m]"
        fi
        ((TOTAL_COUNT++))
    elif [ -n "$actual_stat" ]; then
        stat_part=" [${actual_stat}]"
    elif [ -n "$override_stat" ]; then
        stat_part=" [→ \033[32m${override_stat}\033[0m]"
        ((TOTAL_COUNT++))
    fi
    
    echo -e "${name_part}${stat_part}"
}

# Function to recursively process directory
process_directory() {
    local dir="$1"
    local current_level="$2"
    
    # Check if we've reached max depth
    if [ -n "$MAX_DEPTH" ] && [ "$current_level" -ge "$MAX_DEPTH" ]; then
        return
    fi
    
    # Get list of items in directory
    local items=()
    if [ "$SHOW_HIDDEN" = true ]; then
        while IFS= read -r -d '' item; do
            items+=("$item")
        done < <(find "$dir" -maxdepth 1 -mindepth 1 -print0 | sort -z)
    else
        while IFS= read -r -d '' item; do
            items+=("$item")
        done < <(find "$dir" -maxdepth 1 -mindepth 1 ! -name '.*' -print0 | sort -z)
    fi
    
    local total=${#items[@]}
    local count=0
    
    for item in "${items[@]}"; do
        ((count++))
        local is_last="false"
        if [ $count -eq $total ]; then
            is_last="true"
        fi
        
        show_stat_comparison "$item" "$current_level" "$is_last"
        
        # Recurse into directories
        if [ -d "$item" ]; then
            process_directory "$item" $((current_level + 1))
        fi
    done
}

# Main execution
echo -e "\033[1mComparing file stats with override stats in: $DIR\033[0m"
if [ -n "$MAX_DEPTH" ]; then
    echo "Max depth: $MAX_DEPTH"
fi
echo "----------------------------------------"

# Show root directory
show_stat_comparison "$DIR" 0 "false"

# Process subdirectories
process_directory "$DIR" 1

# Summary
echo "----------------------------------------"
echo "Total files with stat overrides: $TOTAL_COUNT"