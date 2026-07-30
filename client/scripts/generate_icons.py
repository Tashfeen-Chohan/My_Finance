import os
from PIL import Image, ImageDraw, ImageFilter

def create_app_icon(size, is_maskable=False):
    # Render at 4x resolution for super crisp anti-aliasing
    scale = 4
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    margin = 0 if is_maskable else int(canvas_size * 0.04)
    bg_box = [margin, margin, canvas_size - margin, canvas_size - margin]
    
    # Corner radius
    corner_radius = int(canvas_size * 0.20) if not is_maskable else 0

    # Draw dark background (#090d16)
    if is_maskable:
        draw.rectangle([0, 0, canvas_size, canvas_size], fill=(9, 13, 22, 255))
    else:
        if corner_radius > 0:
            draw.rounded_rectangle(bg_box, radius=corner_radius, fill=(9, 13, 22, 255))
            draw.rounded_rectangle(bg_box, radius=corner_radius, outline=(30, 41, 59, 255), width=max(1, int(3 * scale)))
        else:
            draw.rectangle(bg_box, fill=(9, 13, 22, 255))

    # Determine icon scale
    center = canvas_size / 2.0
    icon_scale = 0.52 if is_maskable else 0.62
    icon_dim = canvas_size * icon_scale

    # Soft glowing radial aura
    glow_radius = int(icon_dim * 0.65)
    glow_img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_img)
    glow_draw.ellipse(
        [center - glow_radius, center - glow_radius, center + glow_radius, center + glow_radius],
        fill=(59, 130, 246, 60) # soft primary blue glow
    )
    glow_img = glow_img.filter(ImageFilter.GaussianBlur(radius=max(1, int(15 * scale))))
    img = Image.alpha_composite(img, glow_img)
    draw = ImageDraw.Draw(img)

    # Growth bars geometry
    w_unit = icon_dim / 6.0
    h_unit = icon_dim / 6.0
    left_x = center - icon_dim / 2.0
    top_y = center - icon_dim / 2.0

    # Bar 1: Emerald (Left)
    b1_left = int(left_x + 0.6 * w_unit)
    b1_top = int(top_y + 2.2 * h_unit)
    b1_right = int(b1_left + 1.2 * w_unit)
    b1_bottom = int(top_y + 5.2 * h_unit)
    r1 = max(1, int((b1_right - b1_left) / 2))
    if b1_right > b1_left and b1_bottom > b1_top:
        draw.rounded_rectangle([b1_left, b1_top, b1_right, b1_bottom], radius=r1, fill=(16, 185, 129, 255))

    # Bar 2: Blue (Center apex)
    b2_left = int(left_x + 2.4 * w_unit)
    b2_top = int(top_y + 0.9 * h_unit)
    b2_right = int(b2_left + 1.2 * w_unit)
    b2_bottom = int(top_y + 5.2 * h_unit)
    r2 = max(1, int((b2_right - b2_left) / 2))
    if b2_right > b2_left and b2_bottom > b2_top:
        draw.rounded_rectangle([b2_left, b2_top, b2_right, b2_bottom], radius=r2, fill=(59, 130, 246, 255))

    # Bar 3: Gold (Right surge)
    b3_left = int(left_x + 4.2 * w_unit)
    b3_top = int(top_y + 2.6 * h_unit)
    b3_right = int(b3_left + 1.2 * w_unit)
    b3_bottom = int(top_y + 5.2 * h_unit)
    r3 = max(1, int((b3_right - b3_left) / 2))
    if b3_right > b3_left and b3_bottom > b3_top:
        draw.rounded_rectangle([b3_left, b3_top, b3_right, b3_bottom], radius=r3, fill=(245, 158, 11, 255))

    # Arrow cap / sparkle
    arrow_r = max(2, int(0.7 * w_unit))
    ax = int(left_x + 4.8 * w_unit)
    ay = int(top_y + 1.5 * h_unit)
    if arrow_r > 1:
        draw.regular_polygon((ax, ay, arrow_r), 3, rotation=0, fill=(245, 158, 11, 255))

    # Downsample
    return img.resize((size, size), Image.Resampling.LANCZOS)

def generate_all_icons():
    output_dir = "/home/homodeus/Projects/My_Finance/client/public/icons"
    os.makedirs(output_dir, exist_ok=True)
    public_dir = "/home/homodeus/Projects/My_Finance/client/public"

    sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512]

    for sz in sizes:
        icon = create_app_icon(sz, is_maskable=False)
        icon.save(os.path.join(output_dir, f"icon-{sz}x{sz}.png"))
        if sz == 32:
            icon.save(os.path.join(output_dir, "favicon-32x32.png"))
        elif sz == 16:
            icon.save(os.path.join(output_dir, "favicon-16x16.png"))
        elif sz == 180:
            icon.save(os.path.join(output_dir, "apple-touch-icon.png"))
            icon.save(os.path.join(public_dir, "apple-touch-icon.png"))

    # Generate maskable 512x512 icon
    maskable_icon = create_app_icon(512, is_maskable=True)
    maskable_icon.save(os.path.join(output_dir, "maskable-icon-512x512.png"))

    # Root fallback icons
    icon_192 = create_app_icon(192, is_maskable=False)
    icon_192.save(os.path.join(public_dir, "icon-192x192.png"))
    icon_512 = create_app_icon(512, is_maskable=False)
    icon_512.save(os.path.join(public_dir, "icon-512x512.png"))

    # Generate multi-size favicon.ico
    icon_16 = create_app_icon(16)
    icon_32 = create_app_icon(32)
    icon_48 = create_app_icon(48)
    icon_32.save(
        os.path.join(public_dir, "favicon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[icon_16, icon_48]
    )

    print("All icons successfully generated!")

if __name__ == "__main__":
    generate_all_icons()
