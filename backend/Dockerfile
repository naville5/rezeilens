# Use official .NET SDK image for build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files first (better layer caching)
COPY *.sln ./
COPY RezilensMVP.Api/*.csproj ./RezilensMVP.Api/

# Restore packages
WORKDIR /src/RezilensMVP.Api
RUN dotnet restore

# Copy all source files
COPY RezilensMVP.Api/. ./

# Build and publish (no need for --no-restore since we already restored)
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./
ENTRYPOINT ["dotnet", "RezilensMVP.Api.dll"]
