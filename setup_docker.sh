#!/bin/bash
# Docker setup script for TripTrop - IA Viajes Inteligentes
# Compatible with macOS and Linux

set -e

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if Docker is installed
check_docker() {
    print_info "Checking if Docker is installed..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed!"
        echo "Please install Docker from: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        print_error "Docker is installed but not running!"
        echo "Please start Docker and try again."
        exit 1
    fi
    
    print_success "Docker is installed and running ($(docker --version))"
}

# Function to check if Docker Compose is installed
check_docker_compose() {
    print_info "Checking if Docker Compose is installed..."
    
    # Check for docker compose (v2, integrated with Docker)
    if docker compose version &> /dev/null; then
        print_success "Docker Compose is installed ($(docker compose version))"
        COMPOSE_CMD="docker compose"
        return 0
    fi
    
    # Check for docker-compose (v1, standalone)
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose is installed ($(docker-compose --version))"
        COMPOSE_CMD="docker-compose"
        return 0
    fi
    
    print_error "Docker Compose is not installed!"
    echo "Please install Docker Compose from: https://docs.docker.com/compose/install/"
    exit 1
}

# Function to build Docker images
build_images() {
    print_info "Building Docker images..."
    echo ""
    if $COMPOSE_CMD build; then
        echo ""
        print_success "Docker images built successfully!"
    else
        echo ""
        print_error "Failed to build Docker images!"
        exit 1
    fi
}

# Function to start containers
start_containers() {
    print_info "Starting Docker containers..."
    echo ""
    if $COMPOSE_CMD up -d; then
        echo ""
        print_success "Containers started successfully!"
    else
        echo ""
        print_error "Failed to start containers!"
        exit 1
    fi
}

# Function to display service URLs
show_urls() {
    echo ""
    echo "════════════════════════════════════════════════"
    print_success "TripTrop is now running!"
    echo "════════════════════════════════════════════════"
    echo ""
    echo "🌐 Access the application at:"
    echo "   📱 Frontend:  http://localhost:5173"
    echo "   🔧 Backend:   http://localhost:8000"
    echo "   📚 API Docs:  http://localhost:8000/docs"
    echo ""
    echo "════════════════════════════════════════════════"
    echo ""
}

# Function to show container status
show_status() {
    print_info "Container status:"
    echo ""
    $COMPOSE_CMD ps
    echo ""
}

# Function to stop containers
stop_containers() {
    print_info "Stopping Docker containers..."
    echo ""
    if $COMPOSE_CMD down; then
        echo ""
        print_success "Containers stopped successfully!"
    else
        echo ""
        print_error "Failed to stop containers!"
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "TripTrop Docker Setup Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  start     Build images and start containers (default)"
    echo "  stop      Stop and remove containers"
    echo "  restart   Restart containers"
    echo "  status    Show container status"
    echo "  logs      Show container logs"
    echo "  help      Show this help message"
    echo ""
}

# Main script execution
main() {
    echo ""
    echo "🚀 TripTrop - IA Viajes Inteligentes"
    echo "════════════════════════════════════════════════"
    echo ""
    
    # Check prerequisites
    check_docker
    check_docker_compose
    echo ""
    
    # Parse command line arguments
    ACTION=${1:-start}
    
    case "$ACTION" in
        start)
            build_images
            start_containers
            show_urls
            show_status
            print_info "To stop the containers, run: $0 stop"
            ;;
        stop)
            stop_containers
            ;;
        restart)
            print_info "Restarting containers..."
            stop_containers
            echo ""
            start_containers
            show_urls
            show_status
            ;;
        status)
            show_status
            ;;
        logs)
            print_info "Showing container logs (press Ctrl+C to exit)..."
            echo ""
            $COMPOSE_CMD logs -f
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown option: $ACTION"
            echo ""
            show_help
            exit 1
            ;;
    esac
    
    echo ""
}

# Run main function
main "$@"
