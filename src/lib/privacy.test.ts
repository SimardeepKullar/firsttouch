import { describe, expect, it } from 'vitest';
import { CONTACT_EMAIL, mailtoHref, PRIVACY_BLOCKS, PRIVACY_TITLE, spanText, type Block } from './privacy';

const paragraphs = PRIVACY_BLOCKS.filter((b): b is Extract<Block, { type: 'p' }> => b.type === 'p');
const tables = PRIVACY_BLOCKS.filter((b): b is Extract<Block, { type: 'table' }> => b.type === 'table');

describe('privacy policy content', () => {
  it('has all three tables', () => {
    expect(tables).toHaveLength(3);
  });

  it('gives every table row one cell per column (the phone view pairs cells with headers)', () => {
    for (const t of tables) {
      for (const row of t.rows) expect(row).toHaveLength(t.headers.length);
    }
  });

  it('keeps the effective date placeholder until T-66 fills it in', () => {
    expect(spanText(paragraphs[0]!.spans)).toBe('Effective date: [date]');
  });

  it('leaves the byline out', () => {
    const all = JSON.stringify(PRIVACY_BLOCKS) + PRIVACY_TITLE;
    expect(all).not.toContain('@Simar');
    expect(all).not.toContain('Nov 2, 2026');
  });

  it('has the contact email as a mailto span', () => {
    const contact = paragraphs.at(-1)!;
    expect(contact.spans).toContainEqual({ mailto: CONTACT_EMAIL });
    expect(mailtoHref(CONTACT_EMAIL)).toBe(`mailto:${CONTACT_EMAIL}`);
  });
});
