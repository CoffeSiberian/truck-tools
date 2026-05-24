# Maintainer: CoffeSiberian <https://github.com/CoffeSiberian>
# Contributor: heldr <https://github.com/heldr>
Name:           truck-tools
Version:        0.12.4
Release:        1%{?dist}
Summary:        Save game editor for American Truck Simulator and Euro Truck Simulator 2
License:        MIT
URL:            https://github.com/CoffeSiberian/truck-tools
Source0:        %{url}/archive/v%{version}/%{name}-%{version}.tar.gz

# Disable LTO — conflicts with the ring crate's assembly code
%global _lto_cflags %{nil}

# Prevent RPM from scanning bundled Rust/JS deps for provides/requires
%global __provides_exclude_from ^%{_libdir}/%{name}/.*
%global __requires_exclude_from ^%{_libdir}/%{name}/.*

BuildRequires:  cargo
BuildRequires:  nodejs
BuildRequires:  pnpm
BuildRequires:  gcc
BuildRequires:  openssl-devel
BuildRequires:  gtk3-devel
BuildRequires:  webkit2gtk4.1-devel
BuildRequires:  libappindicator-gtk3-devel
BuildRequires:  glib2-devel
BuildRequires:  cairo-devel
BuildRequires:  pango-devel
BuildRequires:  gdk-pixbuf2-devel

Requires:       gtk3
Requires:       webkit2gtk4.1
Requires:       openssl-libs
Requires:       libappindicator-gtk3
Requires:       glib2
Requires:       cairo
Requires:       pango
Requires:       gdk-pixbuf2

%description
Truck Tools is a save game editor for American Truck Simulator and
Euro Truck Simulator 2.

%prep
%autosetup -n %{name}-%{version}
# Disable updater artifact signing (users update via package manager)
sed -i 's/"createUpdaterArtifacts": true/"createUpdaterArtifacts": false/' src-tauri/tauri.conf.json

%build
pnpm install --no-frozen-lockfile
pnpm tauri build --bundles deb

%install
_debdata="src-tauri/target/release/bundle/deb/Truck Tools_%{version}_amd64"
mkdir -p _debdata_extracted
tar xzf "$_debdata/data.tar.gz" -C _debdata_extracted

install -Dm755 "_debdata_extracted/usr/bin/Truck Tools"     %{buildroot}%{_bindir}/%{name}
install -Dm644 "_debdata_extracted/usr/share/applications/Truck Tools.desktop" \
    %{buildroot}%{_datadir}/applications/%{name}.desktop
sed -i 's|Exec="Truck Tools"|Exec=%{name}|; s|Icon=Truck Tools|Icon=%{name}|' \
    %{buildroot}%{_datadir}/applications/%{name}.desktop
install -Dm644 "_debdata_extracted/usr/share/icons/hicolor/32x32/apps/Truck Tools.png" \
    %{buildroot}%{_datadir}/icons/hicolor/32x32/apps/%{name}.png
install -Dm644 "_debdata_extracted/usr/share/icons/hicolor/128x128/apps/Truck Tools.png" \
    %{buildroot}%{_datadir}/icons/hicolor/128x128/apps/%{name}.png
install -Dm644 "_debdata_extracted/usr/share/icons/hicolor/256x256@2/apps/Truck Tools.png" \
    %{buildroot}%{_datadir}/icons/hicolor/256x256/apps/%{name}.png

%files
%license LICENSE
%{_bindir}/%{name}
%{_datadir}/applications/%{name}.desktop
%{_datadir}/icons/hicolor/32x32/apps/%{name}.png
%{_datadir}/icons/hicolor/128x128/apps/%{name}.png
%{_datadir}/icons/hicolor/256x256/apps/%{name}.png

%changelog
* Sun May 24 2026 CoffeSiberian <https://github.com/CoffeSiberian> - 0.12.4-1
- Initial package
