# Truck Tools

> [!WARNING]
> This application is not yet completely ready so it could have bugs and problems. This is why the updates arrive as a pre-release.

## Download

To download and install the application you will first need to download the latest version at the following link <https://github.com/CoffeSiberian/truck-tools/releases/latest>

> [!CAUTION]
> Do not download this application through third party sites. Use only this repository to download the application so that you avoid at all costs any malicious file.

## Install

To install you will need to run the downloaded file (**.msi**) where it is likely that Windows will run a SmartScreen alert warning that the executable is unknown and will prevent you from installing the application. To avoid this you will have to enter the options indicated in the following ScreenShot.

<p align="center">
  <img width="450" src="https://i.imgur.com/tpHbu3n.png">
</p>

> [!NOTE]
> This message appears because the application does not have a digital signature (which usually has to be paid for) so the system does not trust it, but it does not directly mean that it is some kind of malicious file. As long as the file you are downloading is from this repository and not from a third party.

## Screenshot

<p align="center">
  <img src="https://i.imgur.com/p2QsDlb.jpeg">
  <img src="https://i.imgur.com/XZo6yUC.jpeg">
</p>

**Many thanks for your help ❤️**

<a href="https://github.com/coffesiberian/truck-tools/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=coffesiberian/truck-tools" />
</a>

### Contribute Translations

Would you like to see Truck Tools in your language? We are using [Weblate][weblate], an easy-to-use platform that allows anyone to translate this project through a convenient web interface.
Create an account and start proposing text strings that could be added to the application in the future.

Remember, contributing translations makes you a collaborator of the project!

### TO DO

- [x] ATS compatibility
- [ ] Logo for the app (desktop icon and the main image of the app)
- [ ] Implement [decrypt_truck][decrypt_truck] library as BETA

#### Trailers

- [x] Modify load weight
- [x] Modify load trailer
- [x] Unlock trailers in restricted areas
- [x] Repair trailer
- [x] Repair all trailers
- [x] Create customized color license plate
- [x] Save license plate data

#### Trucks

- [x] Repair truck
- [x] Repair all trucks
- [x] Infinite fuel on current truck
- [x] Fill fuel
- [x] Fill all trucks fuel
- [x] Create customized color license plate
- [x] Save license plate data
- [x] Set custom engines and transmission

#### Profiles

- [x] Add infinite money
- [x] Add level 100
- [x] Unlock garages
- [x] Unlock all cities
- [x] Unlock all dealerships
- [x] Unlock skills
- [x] Profile backup
- [x] Clone profile
- [x] Clone config
- [x] Clone config between games
- [x] Rename profiles

#### Settings

- [x] Documents Path
- [x] Dark Mode config
- [x] Change language
- [x] Enable console and developer mode
- [x] Change convoy mode slots to `128`

#### Possible features

- Share trailers and trucks with a link
- User account
- Create custom routes
- Reset infractions
- Mods management
- Modify kilometers traveled by the truck
- Changing the truck or trailer (no need to go to the garage)
- Allow cities to be unlocked and grages to be purchased in a specific way and not in a general
- Flexible editor for truck and trailer accessories
- Unblock recruiting agencies
- Discover all the map
- Truck color management

### Related projects

#### DecryptTruck

To decrypt the .sii files, we used as a basis the code from https://github.com/CoffeSiberian/DecryptTruck

#### SII_Decrypt

This repository makes use of SII Decrypt. A library that allows access to ATS and ETS 2 save games.
https://github.com/TheLazyTomcat/SII_Decrypt

#### FindTruckInfo

Script to automate the search for engines and transmissions in the game https://github.com/CoffeSiberian/FindTruckInfo

[weblate]: https://hosted.weblate.org/projects/truck-tools/truck-tools/
[decrypt_truck]: https://crates.io/crates/decrypt_truck
