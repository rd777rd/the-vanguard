from datetime import date

from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime

from accounts.models import User
from core.models import BackingCall, Business, Discussion, Event, Listing, Resource

# Shared login for every seeded demo member — lets you log in as any of them
# (Amara Johnson, Marcus Lee, ...) to explore the app from their point of view.
DEMO_PASSWORD = "vanguard-demo"

MEMBERS = {
    "m1": dict(
        name="Amara Johnson",
        email="amara.johnson@example.com",
        city="Atlanta, GA",
        tags=["Black-owned", "Women"],
        role="Community Organizer",
        bio="Runs a network of neighborhood food co-ops. Here to trade notes on grassroots fundraising.",
        avatar_color="#e8b008",
    ),
    "m2": dict(
        name="Marcus Lee",
        email="marcus.lee@example.com",
        city="Oakland, CA",
        tags=["AAPI", "First-gen"],
        role="Software Engineer",
        bio="First-gen college grad building a free tutoring platform for immigrant families.",
        avatar_color="#3b82c2",
    ),
    "m3": dict(
        name="Sofia Reyes",
        email="sofia.reyes@example.com",
        city="Houston, TX",
        tags=["Latine", "Immigrant"],
        role="Immigration Paralegal",
        bio="Helps families navigate paperwork. Hosts a monthly know-your-rights clinic.",
        avatar_color="#c23b3b",
    ),
    "m4": dict(
        name="Dominique Carter",
        email="dominique.carter@example.com",
        city="Detroit, MI",
        tags=["Black-owned", "Veterans"],
        role="Contractor",
        bio="Veteran-owned renovation crew. Offering mentorship slots for trade apprentices.",
        avatar_color="#2f9e6b",
    ),
    "m5": dict(
        name="Leilani Kahale",
        email="leilani.kahale@example.com",
        city="Remote / Online",
        tags=["Indigenous", "AAPI"],
        role="Nurse Practitioner",
        bio="Telehealth office hours for communities without nearby clinics.",
        avatar_color="#f2c744",
    ),
    "m6": dict(
        name="Jordan Vance",
        email="jordan.vance@example.com",
        city="Bronx, NY",
        tags=["LGBTQ+", "Youth"],
        role="High School Counselor",
        bio="Building a peer-support pipeline for LGBTQ+ students applying to college.",
        avatar_color="#3b82c2",
    ),
    "m7": dict(
        name="Priya Natarajan",
        email="priya.natarajan@example.com",
        city="Chicago, IL",
        tags=["AAPI", "Disability"],
        role="Accessibility Consultant",
        bio="Audits small business sites and storefronts for accessibility, pay-what-you-can.",
        avatar_color="#e8b008",
    ),
    "m8": dict(
        name="Elena Okafor",
        email="elena.okafor@example.com",
        city="Philadelphia, PA",
        tags=["Black-owned", "Elders"],
        role="Retired Educator",
        bio="Tutors GED prep and runs a Saturday reading circle for elders re-entering the workforce.",
        avatar_color="#c23b3b",
    ),
}

DISCUSSIONS = [
    dict(
        author="m1",
        tag="Black-owned",
        title="Anyone run a rotating savings circle (susu/ROSCA)? Looking to start one.",
        body="Six of us want to pool $200/month to help each other cover business start-up costs on rotation. Looking for anyone who has done this and can share how they handled trust and record-keeping.",
        replies=12,
        likes=34,
        created_at="2026-08-10T14:00:00Z",
    ),
    dict(
        author="m3",
        tag="Immigrant",
        title="Free know-your-rights clinic — Houston, Aug 22",
        body="Hosting a walk-in clinic covering ICE encounters, workplace rights, and how to build a family emergency plan. Bring a friend, bring questions.",
        replies=21,
        likes=58,
        created_at="2026-08-08T18:30:00Z",
    ),
    dict(
        author="m6",
        tag="LGBTQ+",
        title="Building a college essay support circle for queer youth",
        body="Looking for 3-4 volunteers to review essays and do mock interviews over the next six weeks. Remote friendly.",
        replies=9,
        likes=27,
        created_at="2026-08-05T12:00:00Z",
    ),
    dict(
        author="m4",
        tag="Veterans",
        title="Apprenticeship slots open — carpentry & electrical",
        body="Taking on two apprentices this fall. Veterans and career-changers welcome, no experience required, paid from day one.",
        replies=15,
        likes=41,
        created_at="2026-07-30T09:15:00Z",
    ),
    dict(
        author="m7",
        tag="Disability",
        title="Checklist: making your storefront accessible on a tight budget",
        body="Compiled a punch-list of low-cost fixes (ramps, signage, door pressure, counter height) that make the biggest difference. Happy to walk through it with anyone.",
        replies=18,
        likes=63,
        created_at="2026-07-28T16:45:00Z",
    ),
]

RESOURCES = [
    dict(
        category="Know Your Rights",
        title="What to do during an ICE encounter",
        summary="Your rights at home, at work, and on the street — plus a printable family emergency plan.",
        minutes=6,
        body="You have the right to remain silent and the right to refuse entry without a signed judicial warrant. Keep a red card with you at all times. Memorize an emergency contact and designate a caregiver for any children. Never sign anything you don't understand — ask for an interpreter, it is your right. Document badge numbers and agency names if safe to do so.",
    ),
    dict(
        category="Know Your Rights",
        title="Tenant rights when your landlord won't make repairs",
        summary="How to document issues, request repairs in writing, and escalate to local housing authorities.",
        minutes=5,
        body="Put every repair request in writing and keep dated photos. Most cities require landlords to fix habitability issues (heat, water, mold, pests) within a set window after written notice. If ignored, you may be able to file a complaint with your local housing authority or withhold rent into an escrow account — check your state's rules first, since procedures vary.",
    ),
    dict(
        category="Financial Literacy",
        title="Building credit from zero without going into debt",
        summary="Secured cards, credit-builder loans, and becoming an authorized user — the pros and cons of each.",
        minutes=7,
        body="A secured card backed by a small deposit reports to all three bureaus and is the lowest-risk starting point. Credit-builder loans work in reverse: your 'loan' sits in a locked account while you make payments, building history without upfront debt. Becoming an authorized user on a family member's long-standing account can add years of history overnight — just confirm the primary holder has low utilization and no missed payments.",
    ),
    dict(
        category="Financial Literacy",
        title="How rotating savings circles (susu, tandas, hui) actually work",
        summary="A centuries-old mutual aid tool, and how to run one safely with people you trust.",
        minutes=8,
        body="Every member contributes a fixed amount on a fixed schedule, and one member takes the full pot each round until everyone has received it once. Write down the order in advance, keep a shared ledger, and start small with people you already trust before scaling up. It's an interest-free way to access a lump sum for a business, emergency, or big purchase.",
    ),
    dict(
        category="Health & Wellness",
        title="Finding a culturally competent therapist on a budget",
        summary="Sliding-scale directories, community mental health centers, and what to ask in a first call.",
        minutes=5,
        body="Community mental health centers are required to offer services on a sliding fee scale regardless of insurance. Ask any provider directly about their experience with your community's specific context — you're allowed to interview a few before committing. Open Path Collective and similar directories list therapists offering reduced rates specifically for underinsured clients.",
    ),
    dict(
        category="Health & Wellness",
        title="Telehealth options when the nearest clinic is hours away",
        summary="What telehealth can and can't do, and how to get a prescription filled remotely.",
        minutes=4,
        body="Telehealth works well for follow-ups, mental health, and many prescription renewals, but can't replace hands-on exams for acute issues. Many federally qualified health centers now offer phone or video visits on the same sliding scale as in-person care — call and ask specifically for telehealth scheduling.",
    ),
    dict(
        category="Education",
        title="FAFSA and beyond: aid every first-gen student should know about",
        summary="Federal aid, tribal college grants, and community scholarships that don't ask for a 4.0.",
        minutes=6,
        body="File the FAFSA even if you assume you won't qualify — it also unlocks state aid and many institutional scholarships. Tribal colleges and HBCUs often have dedicated emergency and completion grants with far less competition than national scholarships. Local community foundations frequently have small scholarships that go unclaimed every year simply because too few students apply.",
    ),
    dict(
        category="Civic Power",
        title="How to check your voter registration and know your deadlines",
        summary="State-by-state registration checks, ID rules, and vote-by-mail timelines.",
        minutes=4,
        body="Registration rules, ID requirements, and deadlines vary significantly by state — check your state election office's official site directly rather than relying on secondhand info. If you've moved, changed your name, or haven't voted in a few cycles, re-confirm your registration status before an election, not on election day.",
    ),
    dict(
        category="Civic Power",
        title="Running for a local seat: school board, city council, and beyond",
        summary="The lowest-barrier entry points into elected office, and what filing actually requires.",
        minutes=7,
        body="Local seats — school board, water district, city council — often require only a small number of signatures and no campaign war chest to get on the ballot. These races are decided by hundreds of votes, not millions, which means organized communities can win them. Start by attending a few meetings and requesting your county's candidate filing packet.",
    ),
]

BACKING_CALLS = [
    dict(
        type="request",
        author="m3",
        title="Need a legal review before signing a commercial lease",
        detail="Ready to move my practice into a real storefront. Want a second set of eyes on the lease terms before I sign anything.",
        city="Houston, TX",
        created_at="2026-08-12T10:00:00Z",
    ),
    dict(
        type="offer",
        author="m4",
        title="Free apprenticeship slots — carpentry & electrical",
        detail="Twenty years running crews. Taking on two apprentices this fall, paid from day one, no experience required — just show up ready to learn a trade that pays.",
        city="Detroit, MI",
        created_at="2026-08-11T09:00:00Z",
    ),
    dict(
        type="request",
        author="m6",
        title="Looking for a co-signer or small capital injection",
        detail="Restocking inventory before the holiday rush. Need $2-3K bridge capital or a co-signer — happy to walk anyone through the numbers first.",
        city="Bronx, NY",
        created_at="2026-08-09T20:00:00Z",
    ),
    dict(
        type="offer",
        author="m7",
        title="Free accessibility audit for your storefront or site",
        detail="Physical space or website — I'll find what's costing you customers and hand you a punch-list to fix it, no charge.",
        city="Chicago, IL",
        created_at="2026-08-07T13:00:00Z",
    ),
    dict(
        type="offer",
        author="m5",
        title="Free strategy call before you raise your first round",
        detail="Advised a dozen founders through their first raise. One free 30-minute call — bring your deck, leave with a punch list.",
        city="Remote / Online",
        created_at="2026-08-06T17:00:00Z",
    ),
    dict(
        type="request",
        author="m1",
        title="Seeking a grant-writer for a community initiative",
        detail="Have the plan and the community backing for a neighborhood co-op expansion — need someone fluent in grant language to help land the funding.",
        city="Atlanta, GA",
        created_at="2026-08-05T15:00:00Z",
    ),
    dict(
        type="offer",
        author="m8",
        title="Closed-door session: negotiating your first six-figure contract",
        detail="Spent thirty years in classrooms and boardrooms. Running a small-group session on reading a contract, and holding your ground at the table.",
        city="Philadelphia, PA",
        created_at="2026-08-03T18:00:00Z",
    ),
]

LISTINGS = [
    dict(
        type="service",
        title="Resume & LinkedIn overhaul — 1 hour session",
        price="$0 – pay it forward",
        seller="m2",
        city="Oakland, CA",
        category="Career",
    ),
    dict(
        type="good",
        title="Bundle of children's books, gently used (30+)",
        price="$15 or trade",
        seller="m8",
        city="Philadelphia, PA",
        category="Household",
    ),
    dict(
        type="job",
        title="Part-time bookkeeper needed — flexible hours",
        price="$22/hr",
        seller="m1",
        city="Atlanta, GA",
        category="Jobs",
    ),
    dict(
        type="service",
        title="Basic home electrical repair",
        price="$40 flat / low-income discount available",
        seller="m4",
        city="Detroit, MI",
        category="Home",
    ),
    dict(
        type="good",
        title="Folding tables & chairs for community events (loan)",
        price="Free to borrow",
        seller="m6",
        city="Bronx, NY",
        category="Household",
    ),
    dict(
        type="job",
        title="Weekend translator (Spanish/English) for clinic",
        price="$25/hr",
        seller="m3",
        city="Houston, TX",
        category="Jobs",
    ),
]

BUSINESSES = [
    dict(name="Copper Kettle Coffee Co.", owner="m1", category="Food & Drink", city="Atlanta, GA", tags=["Black-owned", "Women"]),
    dict(name="Lee Family Tutoring", owner="m2", category="Education", city="Oakland, CA", tags=["AAPI", "First-gen"]),
    dict(name="Reyes Immigration Services", owner="m3", category="Legal", city="Houston, TX", tags=["Latine", "Immigrant"]),
    dict(name="Carter & Sons Renovation", owner="m4", category="Home & Trade", city="Detroit, MI", tags=["Black-owned", "Veterans"]),
    dict(name="Kahale Wellness Telehealth", owner="m5", category="Health", city="Remote / Online", tags=["Indigenous"]),
    dict(name="Natarajan Access Consulting", owner="m7", category="Consulting", city="Chicago, IL", tags=["AAPI", "Disability"]),
]

EVENTS = [
    dict(
        title="Know-Your-Rights Clinic",
        date=date(2026, 8, 22),
        time="10:00 AM",
        city="Houston, TX",
        host="m3",
        description="Walk-in clinic covering ICE encounters, workplace rights, and family emergency planning.",
    ),
    dict(
        title="Rotating Savings Circle 101",
        date=date(2026, 8, 27),
        time="6:30 PM",
        city="Remote / Online",
        host="m1",
        description="An intro workshop on starting and running a susu/ROSCA savings circle with people you trust.",
    ),
    dict(
        title="Trade Apprenticeship Info Session",
        date=date(2026, 9, 3),
        time="5:00 PM",
        city="Detroit, MI",
        host="m4",
        description="Learn about paid carpentry & electrical apprenticeship slots opening this fall.",
    ),
    dict(
        title="Queer Youth College Essay Circle",
        date=date(2026, 9, 10),
        time="4:00 PM",
        city="Remote / Online",
        host="m6",
        description="Six-week series pairing volunteers with students on essays and mock interviews.",
    ),
    dict(
        title="Accessible Storefronts Workshop",
        date=date(2026, 9, 17),
        time="1:00 PM",
        city="Chicago, IL",
        host="m7",
        description="Hands-on walkthrough of low-cost accessibility fixes for small business owners.",
    ),
]


class Command(BaseCommand):
    help = "Seeds The Vanguard's demo members, discussions, backing board, marketplace, businesses, events, and resource library."

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Delete existing demo content and seeded members before reseeding.",
        )

    def handle(self, *args, **options):
        if options["flush"]:
            self.stdout.write("Flushing existing demo content...")
            Discussion.objects.all().delete()
            BackingCall.objects.all().delete()
            Listing.objects.all().delete()
            Business.objects.all().delete()
            Event.objects.all().delete()
            Resource.objects.all().delete()
            User.objects.filter(email__in=[m["email"] for m in MEMBERS.values()]).delete()

        member_objs = {}
        for key, data in MEMBERS.items():
            user, created = User.objects.get_or_create(
                email=data["email"],
                defaults=dict(
                    name=data["name"],
                    city=data["city"],
                    tags=data["tags"],
                    role=data["role"],
                    bio=data["bio"],
                    avatar_color=data["avatar_color"],
                ),
            )
            # Always (re)set the demo password rather than trust
            # has_usable_password() — an empty/blank hash from an older run
            # of this command reads as "usable" to Django even though no
            # password will ever match it, so a conditional check here can
            # silently leave demo members unable to log in.
            user.set_password(DEMO_PASSWORD)
            user.save(update_fields=["password"])
            member_objs[key] = user
            self.stdout.write(f"{'Created' if created else 'Exists'}: {user.name}")

        if Discussion.objects.exists():
            self.stdout.write(self.style.WARNING("Discussions already exist — skipping content seed. Use --flush to reseed."))
            self.stdout.write(f"Log in as any seeded member with password: {DEMO_PASSWORD}")
            return

        for d in DISCUSSIONS:
            disc = Discussion.objects.create(
                author=member_objs[d["author"]],
                tag=d["tag"],
                title=d["title"],
                body=d["body"],
                replies=d["replies"],
                likes=d["likes"],
            )
            Discussion.objects.filter(pk=disc.pk).update(created_at=parse_datetime(d["created_at"]))

        for r in RESOURCES:
            Resource.objects.create(**r)

        for b in BACKING_CALLS:
            call = BackingCall.objects.create(
                author=member_objs[b["author"]],
                type=b["type"],
                title=b["title"],
                detail=b["detail"],
                city=b["city"],
            )
            BackingCall.objects.filter(pk=call.pk).update(created_at=parse_datetime(b["created_at"]))

        for listing in LISTINGS:
            Listing.objects.create(
                seller=member_objs[listing["seller"]],
                type=listing["type"],
                title=listing["title"],
                price=listing["price"],
                city=listing["city"],
                category=listing["category"],
            )

        for biz in BUSINESSES:
            owner = member_objs[biz["owner"]]
            Business.objects.create(
                name=biz["name"],
                owner=owner,
                owner_name=owner.name,
                category=biz["category"],
                city=biz["city"],
                tags=biz["tags"],
            )

        for ev in EVENTS:
            host = member_objs[ev["host"]]
            Event.objects.create(
                title=ev["title"],
                date=ev["date"],
                time=ev["time"],
                city=ev["city"],
                host=host,
                host_name=host.name,
                description=ev["description"],
            )

        self.stdout.write(self.style.SUCCESS("The Vanguard demo data is seeded."))
        self.stdout.write(f"Log in as any seeded member with password: {DEMO_PASSWORD}")
