// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: bible;

/**
 * YouVersion Bible Verse of the Day Lock Screen Widget
 * A mouthful, yes.
 * Seriously. Why isn't this already a thing?
 * And why did I have to spend two hours making this?
 */

// Customizations
const textSize = 10;
const textOpacity = 0.7;
const bibleVersion = 68; // GNT

// Find day of the year (0-365)
const date = new Date();
const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24) - 1;

// Get all VOTDs
let request = new Request('https://nodejs.bible.com/api/moments/votd/3.1');
let votds = await request.loadJSON();
votds = votds['votd'];

// Get VOTD for today
let usfm = votds[dayOfYear]['usfm'];
request = new Request(`https://nodejs.bible.com/api/bible/verse/3.1?id=${bibleVersion}&reference=${usfm[0]}`);
let votd = await request.loadJSON();

// Create widget
let widget = new ListWidget();
// Redirect to VOTD when clicked
widget.url = 'youversion://verse-of-the-day';

// Add the verse content
let content = widget.addText(votd['content']);
content.font = Font.lightMonospacedSystemFont(textSize);
content.textOpacity = textOpacity;
content.minimumScaleFactor = 6 / textSize;

// Add the verse reference
let reference = widget.addText(votd['reference']['human']);
reference.font = Font.regularMonospacedSystemFont(textSize);
reference.textOpacity = textOpacity;

// If VOTD is multiple verses
if (usfm.length > 1) {
    content.text += ' ...';
    reference.text = `${votd['reference']['human']}-${usfm[usfm.length - 1].split('.')[2]}`;
}

// Set widget
Script.setWidget(widget);
Script.complete();
