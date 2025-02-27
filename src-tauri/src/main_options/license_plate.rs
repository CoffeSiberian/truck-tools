pub fn get_license_plate_formated(
    bg_plate_color: &str,
    text_plate_color: &str,
    license_plate: &str,
    color_margin: bool,
) -> String {
    if color_margin {
        return format!(
            "<margin left=-15><color value=ff{}><img src=/material/ui/white.mat height=50 width=200><ret><offset hshift=-0.1 vshift=7.5><img src=/material/ui/white.mat height=35 width=155 color=ff{}><ret><offset hshift=0 vshift=14.5>{}|belgium",
            text_plate_color, bg_plate_color, license_plate
        );
    }

    return format!(
        "<color value=ff{}><margin left=-15><img src=/material/ui/white.mat xscale=stretch yscale=stretch><ret><margin left=2><align hstyle=left vstyle=center><font xscale=1 yscale=1 ><color value=ff{}>{}</align></margin>|belgium",
        bg_plate_color, text_plate_color, license_plate
    );
}
