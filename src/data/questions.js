// MUTUALS Question Bank 3.0 — a real group-chat game, not an AI party pack.
// Core mechanic unchanged: you answer about YOURSELF (prompt), friends guess
// what you picked (about). Scoring is keyed by question id.
//
// Each question:
//   id, pack, lean, slot, heat, shareable, prompt, about, options
//
// pack: default | chaos | extended
// lean: duo | group | both
// slot: warmup | roast | receipt | ego | status | flirt | money | party | tension | sincere
// heat: 1 safe · 2 playful · 3 real · 4 spicy · 5 nuclear-but-playable        shareable: boolean

export const ALL_QUESTIONS = [
  // ============================ core bank ============================
  { id: "q1", pack: "default", lean: "both", slot: "receipt", heat: 3, shareable: true,
    prompt: "My most obvious texting crime is…", about: "{name}'s most obvious texting crime is…",
    options: ["Replying in my head", "Going dry on purpose", "Sending five messages", "Reacting instead of answering"] },
  { id: "q2", pack: "default", lean: "both", slot: "tension", heat: 4, shareable: true,
    prompt: "When I want attention, I usually…", about: "When {name} wants attention, they usually…",
    options: ["Act impossible to reach", "Post something targeted", "Start a random argument", "Pretend I don't"] },
  { id: "q3", pack: "default", lean: "both", slot: "receipt", heat: 4, shareable: true,
    prompt: "The text from me that means I'm annoyed is…", about: "The text from {name} that means they're annoyed is…",
    options: ["ok", "lol you're good", "do whatever", "no reply at all"] },
  { id: "q4", pack: "default", lean: "both", slot: "tension", heat: 4, shareable: true,
    prompt: "The tiny disrespect I clock immediately is…", about: "The tiny disrespect {name} clocks immediately is…",
    options: ["Not being invited", "Getting interrupted", "Being corrected in public", "A late reply, no apology"] },
  { id: "q5", pack: "default", lean: "group", slot: "receipt", heat: 4, shareable: true,
    prompt: "What do I pretend I forgot but absolutely remember?", about: "What does {name} pretend they forgot but absolutely remember?",
    options: ["Who showed up", "Who canceled", "Who copied me", "Who never checked in"] },
  { id: "q6", pack: "default", lean: "both", slot: "roast", heat: 3, shareable: true,
    prompt: "What am I delusional about in a charming way?", about: "What is {name} delusional about in a charming way?",
    options: ["My timing", "My taste", "How chill I am", "My read on people"] },
  { id: "q7", pack: "default", lean: "both", slot: "ego", heat: 4, shareable: true,
    prompt: "What do I overestimate about myself?", about: "What does {name} overestimate about themselves?",
    options: ["How subtle I am", "How busy I am", "How right I am", "How mysterious I am"] },
  { id: "q8", pack: "default", lean: "group", slot: "receipt", heat: 2, shareable: true,
    prompt: "What invite actually gets me outside?", about: "What invite actually gets {name} outside?",
    options: ["Food is involved", "One person asks directly", "It's last-minute", "I can leave early"] },
  { id: "q9", pack: "default", lean: "group", slot: "receipt", heat: 3, shareable: true,
    prompt: "When plans start dying, I usually…", about: "When plans start dying, {name} usually…",
    options: ["Save them", "Let them die", "Blame the group", "Make a better plan"] },
  { id: "q10", pack: "default", lean: "group", slot: "receipt", heat: 3, shareable: true,
    prompt: "What makes me suddenly active in the group chat?", about: "What makes {name} suddenly active in the group chat?",
    options: ["Drama", "A plan forming", "Someone being wrong", "My name mentioned"] },
  { id: "q11", pack: "default", lean: "group", slot: "receipt", heat: 4, shareable: true,
    prompt: "What am I most likely to screenshot?", about: "What is {name} most likely to screenshot?",
    options: ["A wild take", "A compliment", "A receipt", "Something I shouldn't"] },
  { id: "q12", pack: "default", lean: "duo", slot: "tension", heat: 4, shareable: true,
    prompt: "What do I think I'm hiding well?", about: "What does {name} think they're hiding well?",
    options: ["When I'm annoyed", "When I'm jealous", "When I care", "When I'm bored"] },
  { id: "q13", pack: "default", lean: "group", slot: "roast", heat: 3, shareable: true,
    prompt: "What is my role when the group gets messy?", about: "What is {name}'s role when the group gets messy?",
    options: ["The witness", "The lawyer", "The instigator", "The cleanup crew"] },
  { id: "q14", pack: "default", lean: "group", slot: "ego", heat: 4, shareable: true,
    prompt: "What do I judge people for, unfairly?", about: "What does {name} judge people for, unfairly?",
    options: ["Bad texting", "Trying too hard", "Being late", "Acting too chill"] },
  { id: "q15", pack: "default", lean: "duo", slot: "tension", heat: 4, shareable: true,
    prompt: "What do I do when I'm trying not to care?", about: "What does {name} do when they're trying not to care?",
    options: ["Overdo the jokes", "Act unavailable", "Talk too much", "Get extremely logical"] },
  { id: "q16", pack: "default", lean: "group", slot: "roast", heat: 4, shareable: true,
    prompt: "What does the group know about me that I deny?", about: "What does the group know about {name} that they deny?",
    options: ["I'm sensitive", "I'm competitive", "I'm nosy", "I'm dramatic"] },
  { id: "q17", pack: "default", lean: "duo", slot: "tension", heat: 4, shareable: true,
    prompt: "What am I most likely to pretend is a joke?", about: "What is {name} most likely to pretend is a joke?",
    options: ["A real opinion", "A jealous comment", "A direct insult", "A confession"] },
  { id: "q18", pack: "default", lean: "both", slot: "sincere", heat: 3, shareable: false,
    prompt: "What makes me instantly respect someone?", about: "What makes {name} instantly respect someone?",
    options: ["They keep a secret", "They don't chase", "They admit when they're wrong", "They never keep score out loud"] },
  { id: "q19", pack: "default", lean: "both", slot: "receipt", heat: 4, shareable: true,
    prompt: "What is my most predictable lie?", about: "What is {name}'s most predictable lie?",
    options: ["I'm almost there", "I'm fine", "I don't care", "I forgot"] },
  { id: "q20", pack: "chaos", lean: "group", slot: "chaos", heat: 5, shareable: true,
    prompt: "What would expose me fastest?", about: "What would expose {name} fastest?",
    options: ["Their search history", "Their screenshots", "Their notes app", "Their close-friends story"] },
  { id: "q21", pack: "default", lean: "group", slot: "ego", heat: 3, shareable: true,
    prompt: "What am I weirdly competitive about?", about: "What is {name} weirdly competitive about?",
    options: ["Being funny", "Being right", "Looking unbothered", "Knowing people best"] },
  { id: "q22", pack: "default", lean: "group", slot: "receipt", heat: 4, shareable: true,
    prompt: "What do I do when someone is clearly lying?", about: "What does {name} do when someone is clearly lying?",
    options: ["Let them finish", "Ask one dangerous question", "Hold eye contact", "Screenshot the evidence"] },
  { id: "q23", pack: "default", lean: "both", slot: "sincere", heat: 3, shareable: false,
    prompt: "What makes me feel weirdly chosen?", about: "What makes {name} feel weirdly chosen?",
    options: ["Being asked first", "Being saved a seat", "Being remembered", "Being defended when I'm gone"] },
  { id: "q24", pack: "default", lean: "group", slot: "roast", heat: 3, shareable: true,
    prompt: "What would make the group say 'classic you'?", about: "What would make the group say 'classic {name}'?",
    options: ["Arriving late", "Starting drama", "Being right", "Making it a bit"] },
  { id: "q25", pack: "default", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "What makes me fold immediately on a crush?", about: "What makes {name} fold immediately on a crush?",
    options: ["They're funnier than me", "They barely text back", "They're a little mean", "They're way too confident"] },
  { id: "q26", pack: "default", lean: "duo", slot: "tension", heat: 4, shareable: true,
    prompt: "How do you know a DM mattered to me?", about: "How do you know a DM mattered to {name}?",
    options: ["I waited to reply", "I screenshotted it", "I read it 10 times", "I told one person"] },
  { id: "q27", pack: "default", lean: "group", slot: "status", heat: 4, shareable: true,
    prompt: "What do I quietly want to be ranked #1 in?", about: "What does {name} quietly want to be ranked #1 in?",
    options: ["Funniest", "Most attractive", "Smartest", "Most unbothered"] },
  { id: "q28", pack: "default", lean: "group", slot: "tension", heat: 4, shareable: true,
    prompt: "Whose attention do I act unbothered about but track closely?", about: "Whose attention does {name} act unbothered about but track closely?",
    options: ["An ex", "The popular one", "A crush", "Whoever's ignoring me"] },
  { id: "q29", pack: "default", lean: "both", slot: "ego", heat: 4, shareable: true,
    prompt: "The persona I post vs. who I actually am is…", about: "{name}'s posted persona vs. who they actually are is…",
    options: ["Way more chill online", "Way funnier online", "Way richer online", "Way more popular online"] },
  { id: "q30", pack: "default", lean: "group", slot: "money", heat: 3, shareable: true,
    prompt: "My money tell in a group is…", about: "{name}'s money tell in a group is…",
    options: ["I always 'forgot' my card", "I overpay to look good", "I count every cent", "I go quiet at the bill"] },
  { id: "q31", pack: "default", lean: "group", slot: "receipt", heat: 4, shareable: true,
    prompt: "The petty thing I've kept score of for too long is…", about: "The petty thing {name} has kept score of for too long is…",
    options: ["An unpaid debt", "A copied outfit", "A canceled plan", "An unreturned favor"] },
  { id: "q32", pack: "default", lean: "group", slot: "roast", heat: 3, shareable: true,
    prompt: "My group-chat reputation is mostly…", about: "{name}'s group-chat reputation is mostly…",
    options: ["The ghost", "The yapper", "The planner", "The menace"] },
  { id: "q33", pack: "default", lean: "group", slot: "tension", heat: 4, shareable: true,
    prompt: "What makes me feel left out the fastest?", about: "What makes {name} feel left out the fastest?",
    options: ["An inside joke I missed", "A photo I'm not in", "Plans I heard about late", "Two people getting close"] },
  { id: "q34", pack: "default", lean: "both", slot: "roast", heat: 3, shareable: true,
    prompt: "My most embarrassing recurring behavior is…", about: "{name}'s most embarrassing recurring behavior is…",
    options: ["Texting first too much", "Laughing at my own jokes", "Bringing up the same story", "Checking who viewed it"] },
  { id: "q35", pack: "default", lean: "group", slot: "status", heat: 4, shareable: true,
    prompt: "Whose approval do I secretly chase in the group?", about: "Whose approval does {name} secretly chase in the group?",
    options: ["The funny one", "The honest one", "The popular one", "The one who left"] },
  { id: "q36", pack: "default", lean: "duo", slot: "tension", heat: 4, shareable: true,
    prompt: "What flips me from chill to invested instantly?", about: "What flips {name} from chill to invested instantly?",
    options: ["Being challenged", "Being ignored", "A little jealousy", "Someone doubting me"] },
  { id: "q37", pack: "default", lean: "group", slot: "roast", heat: 3, shareable: true,
    prompt: "What's my most 'main character' moment?", about: "What's {name}'s most 'main character' moment?",
    options: ["Telling the long story", "Arriving last on purpose", "Crying at the function", "Making it about me"] },
  { id: "q38", pack: "default", lean: "both", slot: "receipt", heat: 4, shareable: true,
    prompt: "When I 'forgot to reply,' I really…", about: "When {name} 'forgot to reply,' they really…",
    options: ["Left you on read", "Got distracted, fair", "Didn't want to", "Was waiting for a better mood"] },
  { id: "q39", pack: "default", lean: "group", slot: "ego", heat: 4, shareable: true,
    prompt: "The validation I fish for without admitting it is…", about: "The validation {name} fishes for without admitting it is…",
    options: ["That I'm funny", "That I'm hot", "That I'm smart", "That I'm a good friend"] },
  { id: "q40", pack: "default", lean: "duo", slot: "tension", heat: 4, shareable: true,
    prompt: "How I act when I'm jealous is…", about: "How {name} acts when they're jealous is…",
    options: ["Suddenly very nice", "Suddenly very busy", "Passive-aggressive", "Weirdly competitive"] },
  { id: "q41", pack: "default", lean: "both", slot: "roast", heat: 3, shareable: true,
    prompt: "The thing I do for the story, not the experience, is…", about: "The thing {name} does for the story, not the experience, is…",
    options: ["The risky text", "The chaotic night out", "The dramatic exit", "The 'random' run-in"] },
  { id: "q42", pack: "default", lean: "group", slot: "receipt", heat: 4, shareable: true,
    prompt: "What gets me to actually leave the house?", about: "What gets {name} to actually leave the house?",
    options: ["Someone I like is going", "Free food", "Fear of missing the story", "A specific direct ask"] },
  { id: "q43", pack: "default", lean: "both", slot: "ego", heat: 4, shareable: true,
    prompt: "The 'I'm not like that' thing that is 100% me is…", about: "The 'I'm not like that' thing that is 100% {name} is…",
    options: ["I'm a hater sometimes", "I love attention", "I'm nosy", "I hold grudges"] },
  { id: "q44", pack: "default", lean: "group", slot: "status", heat: 3, shareable: true,
    prompt: "Who in the group am I lowkey trying to impress?", about: "Who in the group is {name} lowkey trying to impress?",
    options: ["The newest member", "The hard-to-read one", "The one I clashed with", "Honestly, everyone"] },
  { id: "q45", pack: "default", lean: "duo", slot: "sincere", heat: 3, shareable: false,
    prompt: "What do I want people to do without making me ask?", about: "What does {name} want people to do without making them ask?",
    options: ["Check in first", "Defend me", "Notice I'm off", "Just show up"] },
  { id: "q46", pack: "default", lean: "duo", slot: "sincere", heat: 3, shareable: false,
    prompt: "The compliment I act normal about but replay later is…", about: "The compliment {name} acts normal about but replays later is…",
    options: ["That I'm easy to be around", "That I'm actually funny", "That people trust me", "That I'm the loyal one"] },
  { id: "q47", pack: "default", lean: "both", slot: "warmup", heat: 2, shareable: true,
    prompt: "Three drinks of energy in, I become…", about: "Three drinks of energy in, {name} becomes…",
    options: ["Everyone's hype man", "Suspiciously honest", "The planner", "Ready to go home"] },
  { id: "q48", pack: "default", lean: "both", slot: "warmup", heat: 2, shareable: true,
    prompt: "My default move in an awkward silence is…", about: "{name}'s default move in an awkward silence is…",
    options: ["Make a joke", "Check my phone", "Ask a question", "Let it get worse"] },
  { id: "q49", pack: "default", lean: "group", slot: "roast", heat: 4, shareable: true,
    prompt: "What would my friends roast me for first?", about: "What would {name}'s friends roast them for first?",
    options: ["My type", "My confidence", "My excuses", "My playlists"] },
  { id: "q50", pack: "default", lean: "both", slot: "tension", heat: 4, shareable: true,
    prompt: "The grudge I'd never admit I'm holding is about…", about: "The grudge {name} would never admit they're holding is about…",
    options: ["A friend who switched up", "Being left out once", "A joke that went too far", "Someone who one-upped me"] },
  { id: "q51", pack: "default", lean: "group", slot: "receipt", heat: 3, shareable: true,
    prompt: "In a group photo I'm the one who…", about: "In a group photo {name} is the one who…",
    options: ["Checks how I look first", "Posts before asking", "Detags myself", "Demands a retake"] },
  { id: "q52", pack: "default", lean: "both", slot: "warmup", heat: 2, shareable: true,
    prompt: "My most obvious tell when I'm lying is…", about: "{name}'s most obvious tell when they're lying is…",
    options: ["Too much detail", "I get quiet", "I laugh weird", "I change the subject"] },
  { id: "q53", pack: "default", lean: "group", slot: "ego", heat: 4, shareable: true,
    prompt: "What do I act humble about but secretly know I'm good at?", about: "What does {name} act humble about but secretly know they're good at?",
    options: ["Reading people", "Being funny", "Looking good", "Getting my way"] },
  { id: "q54", pack: "default", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "My flirting style is honestly…", about: "{name}'s flirting style is honestly…",
    options: ["Insulting them lovingly", "Going fully silent", "Trauma-free oversharing", "Acting unbothered"] },
  { id: "q55", pack: "default", lean: "group", slot: "tension", heat: 4, shareable: true,
    prompt: "What starts a cold war between me and a friend?", about: "What starts a cold war between {name} and a friend?",
    options: ["A dry reply", "A copied move", "Being left out", "A backhanded compliment"] },
  { id: "q56", pack: "default", lean: "both", slot: "warmup", heat: 1, shareable: false,
    prompt: "My honest energy in a new group is…", about: "{name}'s honest energy in a new group is…",
    options: ["Quiet then chaotic", "Instant best friend", "Watching everyone", "Trying too hard"] },
  { id: "q57", pack: "default", lean: "group", slot: "receipt", heat: 4, shareable: true,
    prompt: "What do I say I'll do but everyone knows I won't?", about: "What does {name} say they'll do but everyone knows they won't?",
    options: ["Be on time", "Come out tonight", "Text back fast", "Let it go"] },
  { id: "q58", pack: "default", lean: "group", slot: "status", heat: 4, shareable: true,
    prompt: "If the group ranked everyone, I'd panic about being…", about: "If the group ranked everyone, {name} would panic about being…",
    options: ["The least funny", "The least invited", "The least attractive", "The most forgettable"] },
  { id: "q59", pack: "default", lean: "both", slot: "roast", heat: 3, shareable: true,
    prompt: "My villain origin in this friend group was…", about: "{name}'s villain origin in this friend group was…",
    options: ["Getting left out once", "A betrayal nobody remembers but me", "Losing an argument", "Being underestimated"] },
  { id: "q60", pack: "default", lean: "both", slot: "tension", heat: 4, shareable: true,
    prompt: "The 'just curious' question I ask that isn't casual is…", about: "The 'just curious' question {name} asks that isn't casual is…",
    options: ["Who else is going?", "Did they say anything?", "Are you two close?", "Who saw it?"] },
  { id: "q61", pack: "default", lean: "group", slot: "receipt", heat: 4, shareable: true,
    prompt: "What do I do the second I sense gossip?", about: "What does {name} do the second they sense gossip?",
    options: ["Lean all the way in", "Pretend I'm above it", "Defend the absent person", "Take notes for later"] },
  { id: "q62", pack: "default", lean: "both", slot: "ego", heat: 3, shareable: true,
    prompt: "The thing I'll argue about for no reason is…", about: "The thing {name} will argue about for no reason is…",
    options: ["A take I half-believe", "Who's right about the past", "Directions", "Who's funnier"] },
  { id: "q63", pack: "default", lean: "duo", slot: "sincere", heat: 3, shareable: false,
    prompt: "What's the easiest way to actually reach me?", about: "What's the easiest way to actually reach {name}?",
    options: ["Be direct, no games", "Make me laugh", "Just keep showing up", "Catch me off guard"] },
  { id: "q64", pack: "chaos", lean: "group", slot: "chaos", heat: 5, shareable: true,
    prompt: "If my phone got passed around, the first thing I'd grab it back for is…", about: "If {name}'s phone got passed around, the first thing they'd grab it back for is…",
    options: ["My DMs", "My camera roll", "My notes app", "My search bar"] },

  // ============================ extended bank — spicier social questions ============================
  { id: "q65", pack: "extended", lean: "both", slot: "party", heat: 4, shareable: true,
    prompt: "The last time the night went off the rails, my first move was…", about: "When the night went off the rails, {name}'s first move was…",
    options: ["Find the funniest person", "Text someone I shouldn't", "Disappear", "Start confessing things"] },
  { id: "q66", pack: "extended", lean: "group", slot: "money", heat: 3, shareable: true,
    prompt: "The purchase I had no business making was…", about: "The purchase {name} had no business making was…",
    options: ["Clothes", "Food delivery", "A trip", "Something for attention"] },
  { id: "q67", pack: "extended", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "My worst dating habit is…", about: "{name}'s worst dating habit is…",
    options: ["Getting bored fast", "Ignoring red flags", "Needing a chase", "Acting too chill"] },
  { id: "q68", pack: "extended", lean: "both", slot: "flirt", heat: 5, shareable: true,
    prompt: "What temptation do I pretend I'm above?", about: "What temptation does {name} pretend they're above?",
    options: ["Texting back", "Stalking the page", "Flirting for validation", "Restarting something messy"] },
  { id: "q69", pack: "extended", lean: "both", slot: "party", heat: 4, shareable: true,
    prompt: "The person I become after two drinks is…", about: "The person {name} becomes after two drinks is…",
    options: ["Too honest", "Too friendly", "Too loud", "Too emotional"] },
  { id: "q70", pack: "extended", lean: "duo", slot: "flirt", heat: 5, shareable: true,
    prompt: "What kind of person makes me fold fastest?", about: "What kind of person makes {name} fold fastest?",
    options: ["Funny and unavailable", "Hot and chaotic", "Calm and loaded", "Mean in a charming way"] },
  { id: "q71", pack: "extended", lean: "group", slot: "money", heat: 4, shareable: true,
    prompt: "My money red flag is…", about: "{name}'s money red flag is…",
    options: ["Convenience spending", "Pretending it's fine", "Keeping score", "Buying the image"] },
  { id: "q72", pack: "extended", lean: "group", slot: "status", heat: 5, shareable: true,
    prompt: "The thing I'd never admit made me jealous is…", about: "The thing {name} would never admit made them jealous is…",
    options: ["Someone's relationship", "Someone's money", "Someone's confidence", "Someone's attention"] },
  { id: "q73", pack: "extended", lean: "duo", slot: "flirt", heat: 5, shareable: true,
    prompt: "The worst reason I've stayed too long is…", about: "The worst reason {name} has stayed too long is…",
    options: ["They were hot", "I liked the attention", "I hate starting over", "I wanted to win"] },
  { id: "q74", pack: "extended", lean: "group", slot: "chaos", heat: 4, shareable: true,
    prompt: "The version of me my friends should fear is…", about: "The version of {name} their friends should fear is…",
    options: ["Bored", "Drunk", "Ignored", "Newly single"] },
  { id: "q75", pack: "extended", lean: "both", slot: "flirt", heat: 4, shareable: true,
    prompt: "My type that I keep pretending isn't my type is…", about: "{name}'s type that they keep pretending isn't their type is…",
    options: ["Emotionally unavailable", "A little toxic", "Way too nice", "Out of my league"] },
  { id: "q76", pack: "extended", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "How I end things is usually…", about: "How {name} ends things is usually…",
    options: ["Slow fade", "Pick a fight", "Ghost completely", "Stay friends suspiciously fast"] },
  { id: "q77", pack: "extended", lean: "both", slot: "party", heat: 4, shareable: true,
    prompt: "At the pregame I'm the one who…", about: "At the pregame {name} is the one who…",
    options: ["Pours too heavy", "Plays therapist", "Vanishes early", "Starts the chaos"] },
  { id: "q78", pack: "extended", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "The text I send when I'm a little lonely is…", about: "The text {name} sends when they're a little lonely is…",
    options: ["'u up'", "A meme to an ex", "'we should hang'", "Nothing, I just lurk"] },
  { id: "q79", pack: "extended", lean: "group", slot: "money", heat: 4, shareable: true,
    prompt: "I overspend the most to…", about: "{name} overspends the most to…",
    options: ["Look generous", "Avoid the awkward split", "Impress someone", "Feel better fast"] },
  { id: "q80", pack: "extended", lean: "both", slot: "party", heat: 4, shareable: true,
    prompt: "My most questionable late-night decision pattern is…", about: "{name}'s most questionable late-night decision pattern is…",
    options: ["The second location", "The 2am text", "The 'one more'", "The emotional speech"] },
  { id: "q81", pack: "extended", lean: "group", slot: "status", heat: 4, shareable: true,
    prompt: "What status thing do I pretend I don't care about?", about: "What status thing does {name} pretend they don't care about?",
    options: ["Who's doing better", "Who got invited", "Who's dating up", "Who's winning lately"] },
  { id: "q82", pack: "extended", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "I catch feelings fastest when someone…", about: "{name} catches feelings fastest when someone…",
    options: ["Roasts me well", "Withholds attention", "Is weirdly confident", "Remembers small things"] },
  { id: "q83", pack: "extended", lean: "both", slot: "tension", heat: 4, shareable: true,
    prompt: "What I do when I see an ex out is…", about: "What {name} does when they see an ex out is…",
    options: ["Suddenly thrive", "Leave quietly", "Get way too loud", "Text the group live"] },
  { id: "q84", pack: "extended", lean: "group", slot: "party", heat: 3, shareable: true,
    prompt: "My role on a night out is…", about: "{name}'s role on a night out is…",
    options: ["The instigator", "The mom friend", "The wildcard", "The first to bail"] },
  { id: "q85", pack: "extended", lean: "both", slot: "flirt", heat: 4, shareable: true,
    prompt: "My ego's favorite snack is…", about: "{name}'s ego's favorite snack is…",
    options: ["A like from the right person", "Being someone's 'what if'", "Being missed", "Winning the breakup"] },
  { id: "q86", pack: "extended", lean: "group", slot: "roast", heat: 4, shareable: true,
    prompt: "The thing I do drunk that the group always brings up is…", about: "The thing {name} does drunk that the group always brings up is…",
    options: ["The speeches", "The disappearing act", "The confessions", "The texting spree"] },
  { id: "q87", pack: "extended", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "I keep entertaining the wrong person because…", about: "{name} keeps entertaining the wrong person because…",
    options: ["The attention", "The chase", "The story", "I'm bored"] },
  { id: "q88", pack: "extended", lean: "both", slot: "tension", heat: 4, shareable: true,
    prompt: "What I do when I'm not the favorite anymore is…", about: "What {name} does when they're not the favorite anymore is…",
    options: ["Get extra charming", "Go cold", "Make a new friend out of spite", "Pretend not to notice"] },
  { id: "q89", pack: "extended", lean: "group", slot: "money", heat: 3, shareable: true,
    prompt: "The lie I tell myself about money is…", about: "The lie {name} tells themselves about money is…",
    options: ["It's an investment", "I deserve it", "I'll budget next month", "Everyone else does it"] },
  { id: "q90", pack: "extended", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "I'm most likely to flirt when…", about: "{name} is most likely to flirt when…",
    options: ["I'm a little bored", "I need a win", "Someone else wants them", "I've had two drinks"] },
  { id: "q91", pack: "extended", lean: "both", slot: "party", heat: 4, shareable: true,
    prompt: "My 'I'm just going for one' actually ends with…", about: "{name}'s 'I'm just going for one' actually ends with…",
    options: ["Closing the place", "A new best friend", "A regretted text", "Me home by 10, lying"] },
  { id: "q92", pack: "extended", lean: "group", slot: "status", heat: 4, shareable: true,
    prompt: "The flex I pretend is casual is…", about: "The flex {name} pretends is casual is…",
    options: ["Who I know", "What I spent", "Who wants me", "Where I've been"] },
  { id: "q93", pack: "extended", lean: "both", slot: "tension", heat: 4, shareable: true,
    prompt: "What makes me text the group at 2am is…", about: "What makes {name} text the group at 2am is…",
    options: ["A revelation", "A spiral", "A confession", "A plan nobody asked for"] },
  { id: "q94", pack: "extended", lean: "duo", slot: "flirt", heat: 5, shareable: true,
    prompt: "The red flag I find weirdly attractive is…", about: "The red flag {name} finds weirdly attractive is…",
    options: ["Too confident", "A little mean", "Emotionally unavailable", "Way too much"] },
  { id: "q95", pack: "extended", lean: "group", slot: "roast", heat: 4, shareable: true,
    prompt: "If my friends wrote my dating profile, the warning would be…", about: "If {name}'s friends wrote their dating profile, the warning would be…",
    options: ["Bores easily", "Falls fast", "Allergic to texting back", "Loves a project"] },
  { id: "q96", pack: "extended", lean: "both", slot: "sincere", heat: 3, shareable: false,
    prompt: "What I actually want but play too cool to say is…", about: "What {name} actually wants but plays too cool to say is…",
    options: ["To be chosen first", "To be pursued", "To matter to someone", "To be the priority"] },

];

// Name-pick ideas — parked for a future mechanic (dynamic participant options).
// Not part of the playable bank; not selected anywhere yet.
export const NAMEPICK_IDEAS = [
  { id: "n1", pack: "namepick", lean: "group", slot: "namepick", heat: 3, shareable: true, enabled: false,
    prompt: "The person here I'd trust with my phone unlocked is…", about: "The person {name} would trust with their phone unlocked is…", options: [] },
  { id: "n2", pack: "namepick", lean: "group", slot: "namepick", heat: 4, shareable: true, enabled: false,
    prompt: "The person here who knows too much about me is…", about: "The person who knows too much about {name} is…", options: [] },
  { id: "n3", pack: "namepick", lean: "group", slot: "namepick", heat: 5, shareable: true, enabled: false,
    prompt: "The person here who could ruin me with one screenshot is…", about: "The person who could ruin {name} with one screenshot is…", options: [] },
  { id: "n4", pack: "namepick", lean: "group", slot: "namepick", heat: 4, shareable: true, enabled: false,
    prompt: "The person here I'd call to make a lie sound believable is…", about: "The person {name} would call to make a lie sound believable is…", options: [] },
  { id: "n5", pack: "namepick", lean: "group", slot: "namepick", heat: 4, shareable: true, enabled: false,
    prompt: "The person here I'd least want reading my notes app is…", about: "The person {name} would least want reading their notes app is…", options: [] },
  { id: "n6", pack: "namepick", lean: "group", slot: "namepick", heat: 4, shareable: true, enabled: false,
    prompt: "The person here who has seen the worst version of me is…", about: "The person who has seen the worst version of {name} is…", options: [] },
  { id: "n7", pack: "namepick", lean: "group", slot: "namepick", heat: 4, shareable: true, enabled: false,
    prompt: "The person here who would sell me out funniest is…", about: "The person who would sell {name} out funniest is…", options: [] },
  { id: "n8", pack: "namepick", lean: "group", slot: "namepick", heat: 3, shareable: true, enabled: false,
    prompt: "The person here who reads me too well is…", about: "The person who reads {name} too well is…", options: [] },
  { id: "n9", pack: "namepick", lean: "group", slot: "namepick", heat: 4, shareable: true, enabled: false,
    prompt: "The person here most likely to start the drama is…", about: "The person most likely to start the drama, per {name}, is…", options: [] },
  { id: "n10", pack: "namepick", lean: "group", slot: "namepick", heat: 4, shareable: true, enabled: false,
    prompt: "The person here I'd want on my side in a group argument is…", about: "The person {name} would want on their side in a group argument is…", options: [] },
  { id: "n11", pack: "namepick", lean: "group", slot: "namepick", heat: 3, shareable: true, enabled: false,
    prompt: "The person here who'd survive a week as me is…", about: "The person who'd survive a week as {name} is…", options: [] },
  { id: "n12", pack: "namepick", lean: "group", slot: "namepick", heat: 4, shareable: true, enabled: false,
    prompt: "The person here secretly running this friend group is…", about: "The person {name} thinks is secretly running this friend group is…", options: [] },
  { id: "n13", pack: "namepick", lean: "group", slot: "namepick", heat: 4, shareable: true, enabled: false,
    prompt: "The person here most likely to text an ex tonight is…", about: "The person most likely to text an ex tonight, per {name}, is…", options: [] },
  { id: "n14", pack: "namepick", lean: "group", slot: "namepick", heat: 4, shareable: true, enabled: false,
    prompt: "The person here I'd trust to plan the chaos is…", about: "The person {name} would trust to plan the chaos is…", options: [] },
  { id: "n15", pack: "namepick", lean: "group", slot: "namepick", heat: 4, shareable: true, enabled: false,
    prompt: "The person here most likely to fall first is…", about: "The person most likely to fall first, per {name}, is…", options: [] },
  { id: "n16", pack: "namepick", lean: "group", slot: "namepick", heat: 3, shareable: true, enabled: false,
    prompt: "The person here I'd actually call in a real crisis is…", about: "The person {name} would actually call in a real crisis is…", options: [] },
];

const BY_ID = Object.fromEntries(ALL_QUESTIONS.map((q) => [q.id, q]));
export function getQuestion(id) {
  return BY_ID[id] || null;
}

export function fillName(template, name) {
  return String(template || "").replace(/\{name\}/g, name || "they");
}

// ---------------- deterministic helpers ----------------
function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// How many questions this room runs — 5–8, stable per room (seeded apart from
// the content shuffle so count and questions vary independently). No more
// hardcoded 6 anywhere: Answer/Guess/Reveal all read this via selectQuestions.
export function roomQuestionCount(groupId) {
  return 5 + (hashStr("count:" + String(groupId || "default")) % 4);
}

// "Spice" weighting used for receipt-card priority and tie-breaks.
const SLOT_WEIGHT = {
  receipt: 6, chaos: 6, tension: 5, flirt: 5, money: 4, party: 4, status: 4, ego: 4, roast: 3, warmup: 1, sincere: 0, namepick: 5,
};
export function spiceScore(q) {
  if (!q) return 0;
  return (q.shareable ? 10 : 0) + (q.heat || 0) * 2 + (SLOT_WEIGHT[q.slot] || 0);
}

const WARMUP = ["warmup", "roast"];
const RECEIPT = ["receipt"];
const STATUSY = ["ego", "status", "money"];
const HOT = ["tension", "flirt", "party"];
const SOFT = ["sincere"];

// Build a 5–8 question episode with rhythm + caps, deterministic per room.
// The SET is groupId-seeded (scoring-safe even if mode flips); `mode` only
// re-orders so duo leads intimate / group leads social.
export function selectQuestions(groupId, mode, count) {
  const n = count || roomQuestionCount(groupId);
  const rng = mulberry32(hashStr(String(groupId || "default")));
  const pool = shuffled(
    ALL_QUESTIONS.filter((q) => q.enabled !== false),
    rng
  );

  const used = new Set();
  const out = [];
  let sincere = 0;
  let heat5 = 0;
  let shareable = 0;
  const ok = (q) =>
    !used.has(q.id) && (q.slot !== "sincere" || sincere < 2) && (q.heat < 5 || heat5 < 2);
  const push = (q) => {
    used.add(q.id);
    out.push(q);
    if (q.slot === "sincere") sincere += 1;
    if (q.heat >= 5) heat5 += 1;
    if (q.shareable) shareable += 1;
  };
  const take = (slots, extra) => {
    const q = pool.find((x) => ok(x) && slots.includes(x.slot) && (!extra || extra(x)));
    if (q) push(q);
    return !!q;
  };
  const takeAny = () => {
    const q = pool.find((x) => ok(x));
    if (q) push(q);
    return !!q;
  };

  const steps = [
    () => take(WARMUP) || take(RECEIPT),
    () => take(RECEIPT) || take(WARMUP),
    () => take(STATUSY) || take(RECEIPT),
    () => take(HOT) || take(STATUSY),
    () => (sincere < 2 ? take(SOFT) : false) || take(WARMUP) || take(HOT),
    () => take(["chaos"], (x) => x.shareable) || take(RECEIPT, (x) => x.shareable) || take(HOT),
  ];
  for (let i = 0; i < n; i++) {
    if (!steps[i % steps.length]()) takeAny();
  }
  // guarantee at least 3 shareable receipts in the episode
  for (let i = 0; shareable < 3 && i < out.length; i++) {
    if (out[i].shareable) continue;
    const repl = pool.find((x) => ok(x) && x.shareable);
    if (!repl) break;
    const removed = out[i];
    used.delete(removed.id);
    if (removed.slot === "sincere") sincere -= 1;
    if (removed.heat >= 5) heat5 -= 1;
    out[i] = repl;
    used.add(repl.id);
    shareable += 1;
  }

  if (mode === "duo" || mode === "group") {
    const rank = (q) => (q.lean === mode ? 0 : q.lean === "both" ? 1 : 2);
    out.sort((a, b) => rank(a) - rank(b));
  }
  return out;
}

// A stable mode-leaning preview (e.g. for a "what you'll be asked" peek).
export function previewQuestionsForMode(mode, count = 6) {
  return selectQuestions("preview-" + (mode || "duo"), mode, count);
}

// ---------------- dev/debug ----------------
export function questionCountByLean() {
  const c = { duo: 0, group: 0, both: 0, total: ALL_QUESTIONS.length };
  for (const q of ALL_QUESTIONS) c[q.lean] = (c[q.lean] || 0) + 1;
  return c;
}

const FORBIDDEN = ["love language", "zombie", "dog", "healing", "attachment", " hr ", "therapy", "safe space"];
export function validateQuestionBank() {
  const playable = ALL_QUESTIONS.filter((q) => q.enabled !== false && q.pack !== "namepick");
  const tally = (arr, key) =>
    arr.reduce((m, q) => ((m[q[key]] = (m[q[key]] || 0) + 1), m), {});
  const issues = [];
  const seenPrompt = new Set();
  for (const q of ALL_QUESTIONS) {
    for (const f of ["id", "pack", "lean", "slot", "prompt", "about"]) {
      if (q[f] == null) issues.push(`${q.id}: missing ${f}`);
    }
    if (typeof q.heat !== "number") issues.push(`${q.id}: missing heat`);
    if (typeof q.shareable !== "boolean") issues.push(`${q.id}: missing shareable`);
    const p = (q.prompt || "").toLowerCase();
    if (seenPrompt.has(p)) issues.push(`${q.id}: duplicate prompt`);
    seenPrompt.add(p);
    for (const f of FORBIDDEN) if ((p + " " + (q.about || "")).toLowerCase().includes(f)) issues.push(`${q.id}: forbidden "${f.trim()}"`);
    if (q.pack !== "namepick") {
      if (!Array.isArray(q.options) || q.options.length !== 4) issues.push(`${q.id}: options not 4`);
      else if (new Set(q.options).size !== q.options.length) issues.push(`${q.id}: repeated option`);
    }
  }
  const softCombined = playable.filter((q) =>
    /quiet|misunderstood|reassur|compliment/i.test(q.prompt + " " + q.options.join(" "))
  ).length;
  return {
    total: ALL_QUESTIONS.length,
    playable: playable.length,
    byPack: tally(ALL_QUESTIONS, "pack"),
    byLean: tally(playable, "lean"),
    bySlot: tally(playable, "slot"),
    byHeat: tally(playable, "heat"),
    shareable: playable.filter((q) => q.shareable).length,
    heat4: playable.filter((q) => q.heat === 4).length,
    heat5: playable.filter((q) => q.heat === 5).length,
    sincere: playable.filter((q) => q.slot === "sincere").length,
    softCombined,
    namepickIdeas: NAMEPICK_IDEAS.length,
    issues,
  };
}
