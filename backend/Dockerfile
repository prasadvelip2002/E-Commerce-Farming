FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/API/AgriEcommerce.API.csproj", "src/API/"]
COPY ["src/Application/AgriEcommerce.Application.csproj", "src/Application/"]
COPY ["src/Core/AgriEcommerce.Core.csproj", "src/Core/"]
COPY ["src/Infrastructure/AgriEcommerce.Infrastructure.csproj", "src/Infrastructure/"]
RUN dotnet restore "src/API/AgriEcommerce.API.csproj"

COPY src/ src/
RUN dotnet publish "src/API/AgriEcommerce.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AgriEcommerce.API.dll"]
