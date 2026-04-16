#!/usr/bin/env python3
from fpdf import FPDF

OUTPUT = "/Users/grubbussio/_PROJECTS/Vivint Build/shieldhome-pro/public/guides/home-security-guide.pdf"

# Colors
GREEN = (16, 185, 129)       # #10B981
DARK_SLATE = (30, 41, 59)    # #1E293B
WHITE = (255, 255, 255)
LIGHT_BG = (240, 253, 244)   # light green tint for callout boxes
CALLOUT_BG = (209, 250, 229) # slightly stronger green for stat boxes


class SecurityGuidePDF(FPDF):
    def __init__(self):
        super().__init__('P', 'mm', 'Letter')
        self.set_auto_page_break(auto=False)

    def footer_bar(self):
        self.set_y(-20)
        self.set_font('Helvetica', 'I', 9)
        self.set_text_color(100, 116, 139)
        self.set_draw_color(*GREEN)
        self.line(15, self.get_y(), 195, self.get_y())
        self.ln(3)
        self.cell(0, 6, 'Take the free assessment: shieldhome.pro/meta', 0, 0, 'C')

    def stat_callout(self, text, y=None):
        if y is not None:
            self.set_y(y)
        x = 20
        w = 170
        h = 18
        self.set_fill_color(*CALLOUT_BG)
        self.set_draw_color(*GREEN)
        self.rect(x, self.get_y(), w, h, 'DF')
        self.set_xy(x + 5, self.get_y() + 2)
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(*DARK_SLATE)
        self.multi_cell(w - 10, 7, text, 0, 'C')

    def section_header(self, text):
        self.set_font('Helvetica', 'B', 16)
        self.set_text_color(*GREEN)
        self.multi_cell(0, 8, text, 0, 'L')
        self.ln(3)

    def body_text(self, text):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(*DARK_SLATE)
        self.multi_cell(0, 5.5, text, 0, 'L')
        self.ln(2)

    def action_step(self, text):
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(*GREEN)
        self.cell(5, 6, '>', 0, 0)
        self.set_font('Helvetica', 'I', 10)
        self.set_text_color(*DARK_SLATE)
        self.multi_cell(0, 6, ' ACTION STEP: ' + text, 0, 'L')
        self.ln(2)


pdf = SecurityGuidePDF()

# ── PAGE 1: COVER ──
pdf.add_page()
# Green top band
pdf.set_fill_color(*GREEN)
pdf.rect(0, 0, 216, 12, 'F')

# Title area centered vertically
pdf.set_y(65)
pdf.set_font('Helvetica', 'B', 28)
pdf.set_text_color(*DARK_SLATE)
pdf.multi_cell(0, 12, '7 Blind Spots Burglars\nLook For Before\nTargeting Your Home', 0, 'C')

pdf.ln(8)
pdf.set_font('Helvetica', '', 14)
pdf.set_text_color(100, 116, 139)
pdf.multi_cell(0, 7, 'And what to do about each one\n-- starting tonight', 0, 'C')

pdf.ln(15)
pdf.set_draw_color(*GREEN)
pdf.line(70, pdf.get_y(), 140, pdf.get_y())
pdf.ln(10)

pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(*GREEN)
pdf.cell(0, 6, 'A free guide from ShieldHome Pro', 0, 1, 'C')
pdf.set_font('Helvetica', 'I', 10)
pdf.set_text_color(100, 116, 139)
pdf.cell(0, 6, 'Authorized Vivint Smart Home Dealer', 0, 1, 'C')

# Green bottom band
pdf.set_fill_color(*GREEN)
pdf.rect(0, 267, 216, 12, 'F')

pdf.footer_bar()

# ── PAGE 2: THE STAKES ──
pdf.add_page()
pdf.set_fill_color(*GREEN)
pdf.rect(0, 0, 216, 8, 'F')
pdf.set_y(20)

pdf.set_font('Helvetica', 'B', 24)
pdf.set_text_color(*DARK_SLATE)
pdf.cell(0, 12, 'The Stakes', 0, 1, 'L')
pdf.ln(5)

pdf.body_text(
    'A burglar is in and out of your home in under 10 minutes. Most break-ins happen '
    'between 10am and 3pm while you are at work. Your home is most vulnerable when it '
    'looks the most empty.'
)

pdf.body_text(
    'This guide reveals the seven things that make your home a target to experienced '
    'burglars -- and how you can fix every single one of them starting tonight. No '
    'expensive equipment required for most of these steps.'
)

pdf.body_text(
    'The FBI reports that a burglary occurs every 25.7 seconds in the United States. '
    'That is over 1.2 million home break-ins per year. The average loss per burglary '
    'is $2,661 -- but the emotional toll is far greater.'
)

pdf.ln(5)
pdf.stat_callout('STAT: Homes without a security system are 300% more likely to be burglarized.')

pdf.footer_bar()

# ── PAGE 3: BLIND SPOTS 1-2 ──
pdf.add_page()
pdf.set_fill_color(*GREEN)
pdf.rect(0, 0, 216, 8, 'F')
pdf.set_y(20)

pdf.section_header('Blind Spot #1: Unlocked Side Gates & Back Doors')
pdf.body_text(
    'Most people think burglars kick in the front door. The reality is more nuanced: '
    '34% enter through the front door, 23% through first-floor windows, and 22% through '
    'the back door. Side gates and back entries are prime targets because they offer '
    'cover from neighbors and street traffic.'
)
pdf.action_step(
    'Walk your property perimeter tonight. Lock every side gate and back door. '
    'Add a simple latch lock to any gate that does not have one.'
)
pdf.ln(1)
pdf.stat_callout('STAT: 22% of burglars enter through back doors -- the least monitored entry point.')

pdf.ln(10)

pdf.section_header('Blind Spot #2: No Visible Deterrents')
pdf.body_text(
    'Burglars are opportunists. A University of North Carolina study found that 60% '
    'of convicted burglars said they would avoid a home entirely if they saw visible '
    'security cameras or alarm company signage. Deterrence is your cheapest and most '
    'effective first line of defense.'
)
pdf.action_step(
    'Place a visible security camera or sign near your front door and driveway. '
    'Even a yard sign can make a burglar move to an easier target.'
)
pdf.ln(1)
pdf.stat_callout('STAT: 60% of burglars avoid homes with visible cameras or security signage.')

pdf.footer_bar()

# ── PAGE 4: BLIND SPOTS 3-4 ──
pdf.add_page()
pdf.set_fill_color(*GREEN)
pdf.rect(0, 0, 216, 8, 'F')
pdf.set_y(20)

pdf.section_header('Blind Spot #3: Your Ring Doorbell Is Not a Security System')
pdf.body_text(
    'A video doorbell covers one door. It cannot detect motion at your back windows, '
    'side gate, or garage. It cannot dispatch police, fire, or medical help. It sends '
    'you a notification -- but if you are in a meeting or asleep, that notification '
    'does nothing. A doorbell camera is a convenience tool, not a security system.'
)
pdf.action_step(
    'Audit your coverage: count how many entry points your home has, then count '
    'how many are actually monitored. Most homes have 8-12 entry points and monitor only one.'
)
pdf.ln(1)
pdf.stat_callout('STAT: The average home has 8-12 entry points. A doorbell camera covers exactly 1.')

pdf.ln(10)

pdf.section_header('Blind Spot #4: No WiFi Backup')
pdf.body_text(
    'Experienced burglars know that most smart home devices rely entirely on WiFi. '
    'Cutting power or jamming the WiFi signal disables cameras, smart locks, and sensors '
    'all at once. If your security depends on a single internet connection, a burglar '
    'can defeat it in seconds before even entering your home.'
)
pdf.action_step(
    'Check whether your security system has cellular backup. If it relies only on '
    'WiFi, it has a critical single point of failure that any informed burglar can exploit.'
)
pdf.ln(1)
pdf.stat_callout('STAT: Disabling WiFi is the #1 technique burglars use to defeat DIY security systems.')

pdf.footer_bar()

# ── PAGE 5: BLIND SPOTS 5-6 ──
pdf.add_page()
pdf.set_fill_color(*GREEN)
pdf.rect(0, 0, 216, 8, 'F')
pdf.set_y(20)

pdf.section_header('Blind Spot #5: Timer-Controlled Lights')
pdf.body_text(
    'Putting your lights on a timer seems smart, but burglars who case neighborhoods '
    'spot the pattern within days. Lights that turn on and off at exactly the same time '
    'every night are a clear signal that nobody is home. Smart lighting that varies '
    'randomly and responds to real activity is far more effective.'
)
pdf.action_step(
    'If you use light timers, randomize the schedule. Better yet, use smart lights '
    'that can be triggered by motion sensors or controlled remotely from your phone.'
)
pdf.ln(1)
pdf.stat_callout('STAT: Burglars who case a neighborhood can identify timer patterns in 2-3 days.')

pdf.ln(10)

pdf.section_header('Blind Spot #6: No Glass-Break Detection')
pdf.body_text(
    'Many homeowners assume that window sensors protect against break-ins through '
    'windows. But standard window sensors only detect whether the window is opened -- '
    'not whether the glass is shattered. A burglar can break the glass, reach in, and '
    'enter without ever triggering a standard window sensor.'
)
pdf.action_step(
    'Add glass-break sensors to rooms with ground-floor windows, especially those '
    'hidden from street view. These detect the sound frequency of breaking glass.'
)
pdf.ln(1)
pdf.stat_callout('STAT: Window sensors and glass-break sensors are NOT the same. You likely need both.')

pdf.footer_bar()

# ── PAGE 6: BLIND SPOT 7 (full page) ──
pdf.add_page()
pdf.set_fill_color(*GREEN)
pdf.rect(0, 0, 216, 8, 'F')
pdf.set_y(20)

pdf.set_font('Helvetica', 'B', 24)
pdf.set_text_color(*DARK_SLATE)
pdf.cell(0, 12, 'Blind Spot #7', 0, 1, 'L')
pdf.set_font('Helvetica', 'B', 18)
pdf.set_text_color(*GREEN)
pdf.cell(0, 10, 'Slow or No Emergency Response', 0, 1, 'L')
pdf.ln(5)

pdf.body_text(
    'Average time before police are even notified of a break-in: 8 minutes. The average '
    'burglar is inside your home for 8 to 10 minutes. Do the math -- by the time help '
    'is on the way, the burglar is already gone with your belongings.'
)

pdf.body_text(
    'Professional monitoring with video verification changes the equation entirely. '
    'Instead of waiting for you to notice a notification, check the camera, call 911, '
    'and wait on hold, a monitoring center sees the intrusion in real time and dispatches '
    'help within seconds.'
)

pdf.ln(3)
# Comparison table
pdf.set_font('Helvetica', 'B', 13)
pdf.set_text_color(*DARK_SLATE)
pdf.cell(0, 8, 'Response Time Comparison', 0, 1, 'C')
pdf.ln(3)

# Table header
x_start = 25
col1_w = 80
col2_w = 80
pdf.set_fill_color(*GREEN)
pdf.set_text_color(*WHITE)
pdf.set_font('Helvetica', 'B', 11)
pdf.set_x(x_start)
pdf.cell(col1_w, 10, '  DIY / No Monitoring', 1, 0, 'C', True)
pdf.cell(col2_w, 10, '  Professional Monitoring', 1, 1, 'C', True)

# Table rows
rows = [
    ('Alert sent to your phone', 'Alert sent to monitoring center'),
    ('You check notification (2-5 min)', 'Operator verifies video (< 15 sec)'),
    ('You call 911 (1-2 min)', 'Operator dispatches police (< 15 sec)'),
    ('911 dispatches police (3-5 min)', 'Total: under 30 seconds'),
    ('Total: 8-15 minutes', ''),
]
pdf.set_text_color(*DARK_SLATE)
pdf.set_font('Helvetica', '', 9)
for left, right in rows:
    pdf.set_x(x_start)
    pdf.set_fill_color(245, 245, 245)
    pdf.cell(col1_w, 9, '  ' + left, 1, 0, 'L', True)
    pdf.set_fill_color(*LIGHT_BG)
    pdf.cell(col2_w, 9, '  ' + right, 1, 1, 'L', True)

pdf.ln(8)
pdf.stat_callout('STAT: Professional monitoring with video verification cuts response time to under 30 seconds.')

pdf.footer_bar()

# ── PAGE 7: ELIMINATE ALL 7 ──
pdf.add_page()
pdf.set_fill_color(*GREEN)
pdf.rect(0, 0, 216, 8, 'F')
pdf.set_y(20)

pdf.set_font('Helvetica', 'B', 20)
pdf.set_text_color(*DARK_SLATE)
pdf.multi_cell(0, 9, 'How to Eliminate All 7\nBlind Spots at Once', 0, 'L')
pdf.ln(5)

pdf.body_text(
    'The fastest way to close every blind spot in this guide is a professionally '
    'installed smart home security system with 24/7 monitoring. Instead of piecing '
    'together individual devices and hoping they work together, a unified system covers '
    'every entry point, every vulnerability, all in one platform.'
)

pdf.body_text(
    'This is not about buying the most expensive gadgets. It is about having a system '
    'that actually works when it matters most -- when someone is trying to get into '
    'your home and you are not there to stop them.'
)

pdf.ln(3)
pdf.set_font('Helvetica', 'B', 13)
pdf.set_text_color(*GREEN)
pdf.cell(0, 8, 'What a Professional Smart Home System Provides:', 0, 1, 'L')
pdf.ln(3)

benefits = [
    'Full-perimeter coverage: door sensors, window sensors, glass-break detectors, motion sensors, and cameras covering every entry point -- not just the front door.',
    'Cellular + WiFi backup: your system stays online even if power or internet is cut. No single point of failure.',
    '24/7 professional monitoring with video verification: a real person sees the threat and dispatches help in under 30 seconds, even while you sleep.',
]
for b in benefits:
    pdf.set_x(20)
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(*GREEN)
    pdf.cell(5, 6, chr(149), 0, 0)
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(*DARK_SLATE)
    pdf.multi_cell(165, 6, ' ' + b, 0, 'L')
    pdf.ln(3)

pdf.ln(3)
pdf.stat_callout('STAT: Homes with professionally monitored systems experience 4x fewer break-in losses.')

pdf.footer_bar()

# ── PAGE 8: CTA ──
pdf.add_page()
pdf.set_fill_color(*GREEN)
pdf.rect(0, 0, 216, 8, 'F')
pdf.set_y(55)

pdf.set_font('Helvetica', 'B', 22)
pdf.set_text_color(*DARK_SLATE)
pdf.multi_cell(0, 10, 'Want to Know Your Home\'s\nExact Security Score?', 0, 'C')

pdf.ln(10)
pdf.set_font('Helvetica', '', 13)
pdf.set_text_color(100, 116, 139)
pdf.cell(0, 7, 'Take our free 90-second assessment and find out', 0, 1, 'C')
pdf.cell(0, 7, 'which blind spots your home has right now.', 0, 1, 'C')

pdf.ln(10)

# CTA box
pdf.set_fill_color(*CALLOUT_BG)
pdf.set_draw_color(*GREEN)
box_y = pdf.get_y()
pdf.rect(30, box_y, 150, 50, 'DF')
pdf.set_xy(30, box_y + 8)
pdf.set_font('Helvetica', 'B', 16)
pdf.set_text_color(*GREEN)
pdf.cell(150, 8, 'shieldhome.pro/meta', 0, 1, 'C')
pdf.set_x(30)
pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(*DARK_SLATE)
pdf.cell(150, 8, 'Free 90-Second Security Assessment', 0, 1, 'C')
pdf.ln(2)
pdf.set_x(30)
pdf.set_font('Helvetica', 'B', 14)
pdf.set_text_color(*DARK_SLATE)
pdf.cell(150, 8, 'Or call us: (801) 348-6050', 0, 1, 'C')

pdf.ln(20)
pdf.set_font('Helvetica', 'B', 12)
pdf.set_text_color(*GREEN)
pdf.cell(0, 7, 'ShieldHome Pro', 0, 1, 'C')
pdf.set_font('Helvetica', 'I', 10)
pdf.set_text_color(100, 116, 139)
pdf.cell(0, 7, 'Authorized Vivint Smart Home Dealer', 0, 1, 'C')

# Bottom band
pdf.set_fill_color(*GREEN)
pdf.rect(0, 267, 216, 12, 'F')

pdf.footer_bar()

# Save
pdf.output(OUTPUT, 'F')
print(f"PDF saved to {OUTPUT}")
print(f"Pages: {pdf.page}")
