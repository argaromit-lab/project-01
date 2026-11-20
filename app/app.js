(function () {
  'use strict';

  const STORAGE_KEY = 'leonida-waypoint-progress-v1';
  const SAVE_FORMAT = 'leonida-waypoint-progress/v1';
  const data = window.WAYPOINT_DATA;
  const isSampleView = new URLSearchParams(window.location.search).get('sample') === '1';
  const byId = new Map(data.trophies.map((trophy) => [trophy.id, trophy]));
  const sourceById = new Map(data.sources.map((source) => [source.id, source]));
  const el = (id) => document.getElementById(id);
  const list = el('trophy-list');
  const detail = el('trophy-detail');
  const counts = { platinum: 1, gold: 2, silver: 6, bronze: 46 };
  let selectedId = 15;
  let pendingImport = null;
  let storageWorks = true;
  let filters = { query: '', kind: 'all', grade: 'all', status: 'all' };
  let state = readSave();

  function emptyState() {
    return { earned: [], counters: {}, spoilers: false };
  }

  function normalizedSave(value) {
    const clean = emptyState();
    if (!value || typeof value !== 'object' || Array.isArray(value)) return clean;
    const knownNames = new Set(data.trophies.map((trophy) => trophy.name));
    const ids = new Set(data.trophies.map((trophy) => String(trophy.id)));
    if (Array.isArray(value.earned)) {
      clean.earned = [...new Set(value.earned.filter((entry) => {
        if (typeof entry === 'number') return ids.has(String(entry));
        if (typeof entry === 'string') return knownNames.has(entry) || ids.has(entry);
        return false;
      }).map((entry) => {
        const trophy = typeof entry === 'number' || ids.has(String(entry))
          ? byId.get(Number(entry))
          : data.trophies.find((item) => item.name === entry);
        return trophy.name;
      }))];
    }
    if (value.counters && typeof value.counters === 'object' && !Array.isArray(value.counters)) {
      for (const [rawId, amount] of Object.entries(value.counters)) {
        const trophy = byId.get(Number(rawId));
        if (trophy && trophy.target !== null && Number.isSafeInteger(amount) && amount >= 0 && amount <= trophy.target) {
          if (amount > 0) clean.counters[String(trophy.id)] = amount;
        }
      }
    }
    clean.spoilers = value.spoilers === true;
    return clean;
  }

  function readSave() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? normalizedSave(JSON.parse(raw)) : emptyState();
    } catch {
      storageWorks = false;
      return emptyState();
    }
  }

  function persist(message) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      storageWorks = true;
      el('save-state').textContent = isSampleView ? 'Sample progress · local browser only' : (message || 'Saved in this browser');
      el('save-state').classList.remove('is-error');
    } catch {
      storageWorks = false;
      el('save-state').textContent = 'Browser storage unavailable · export a backup';
      el('save-state').classList.add('is-error');
    }
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
  }

  function gradeBadge(grade) {
    const badge = document.createElement('span');
    badge.className = `grade-badge ${grade}`;
    badge.textContent = grade;
    return badge;
  }

  function isEarned(trophy) {
    return state.earned.includes(trophy.name);
  }

  function storyMasked(trophy) {
    return trophy.story && !state.spoilers && !isEarned(trophy);
  }

  function visible(trophy) {
    if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
    if (filters.status === 'earned' && !isEarned(trophy)) return false;
    if (filters.status === 'unearned' && isEarned(trophy)) return false;
    if (filters.kind !== 'all') {
      const matches = filters.kind === 'story'
        ? trophy.story
        : filters.kind === 'online'
          ? trophy.tags.includes('online')
          : trophy.tags.includes(filters.kind);
      if (!matches) return false;
    }
    const query = filters.query.trim().toLocaleLowerCase();
    if (query) {
      if (storyMasked(trophy)) return false;
      return `${trophy.name} ${trophy.description} ${trophy.guide} ${trophy.grade}`.toLocaleLowerCase().includes(query);
    }
    return true;
  }

  function row(trophy) {
    const hidden = storyMasked(trophy);
    const item = document.createElement('div');
    item.className = `trophy-row${selectedId === trophy.id ? ' is-selected' : ''}`;
    item.setAttribute('role', 'listitem');
    item.dataset.id = String(trophy.id);

    const earnedLabel = document.createElement('label');
    earnedLabel.className = 'earned-control';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isEarned(trophy);
    checkbox.setAttribute('aria-label', hidden ? 'Mark a hidden story trophy earned' : `Mark ${trophy.name} earned`);
    checkbox.addEventListener('click', (event) => event.stopPropagation());
    checkbox.addEventListener('change', () => {
      setEarned(trophy, checkbox.checked);
    });
    earnedLabel.append(checkbox);

    const content = document.createElement('div');
    const title = document.createElement('button');
    title.type = 'button';
    title.className = 'row-title';
    title.textContent = hidden ? 'Story trophy hidden' : trophy.name;
    title.setAttribute('aria-label', hidden ? 'Open a hidden story trophy' : `Open guide for ${trophy.name}`);
    title.addEventListener('click', () => select(trophy.id));
    content.append(title);
    const description = document.createElement('span');
    description.className = 'row-description';
    description.textContent = hidden ? 'Earn it or turn on story details to reveal.' : trophy.description;
    content.append(description);

    const meta = document.createElement('div');
    meta.className = 'row-meta';
    meta.append(gradeBadge(trophy.grade));
    if (trophy.hidden) {
      const mark = document.createElement('span');
      mark.className = 'hidden-mark';
      mark.textContent = 'H';
      mark.title = 'PlayStation hides this trophy until earned';
      mark.setAttribute('aria-label', 'Hidden on PlayStation until earned');
      meta.append(mark);
    }
    item.append(earnedLabel, content, meta);
    item.addEventListener('click', () => select(trophy.id));
    return item;
  }

  function renderList() {
    const filtered = data.trophies.filter(visible);
    list.replaceChildren(...filtered.map(row));
    el('result-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'trophy' : 'trophies'}`;
    el('empty-results').hidden = filtered.length !== 0;
    if (!filtered.some((trophy) => trophy.id === selectedId) && filtered.length) selectedId = filtered[0].id;
    renderDetail();
    updateProgress();
  }

  function renderCitation(citation) {
    const source = sourceById.get(citation.source);
    if (!source) return null;
    const group = document.createElement('div');
    const anchor = document.createElement('a');
    anchor.className = 'citation-link';
    anchor.href = source.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = source.title;
    group.append(anchor);
    const scope = document.createElement('span');
    scope.className = 'citation-scope';
    scope.textContent = `Supports: ${citation.supports}`;
    group.append(scope);
    return group;
  }

  function renderDetail() {
    const trophy = byId.get(selectedId) || data.trophies[0];
    const hidden = storyMasked(trophy);
    detail.replaceChildren();
    if (hidden) {
      detail.classList.add('masked-detail');
      const line = document.createElement('div');
      line.className = 'detail-topline';
      line.textContent = 'Story detail';
      line.append(gradeBadge(trophy.grade));
      const heading = document.createElement('h2');
      heading.textContent = 'Story trophy hidden';
      const message = document.createElement('p');
      message.textContent = 'The name, published description and guide stay concealed until this trophy is earned or you choose to show story details.';
      const control = document.createElement('label');
      control.className = 'earned-detail';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = false;
      checkbox.setAttribute('aria-label', 'Mark this hidden story trophy earned');
      checkbox.addEventListener('change', () => setEarned(trophy, checkbox.checked));
      control.append(checkbox, document.createTextNode('Mark as earned to reveal'));
      detail.append(line, heading, message, control);
      return;
    }
    detail.classList.remove('masked-detail');

    const topline = document.createElement('div');
    topline.className = 'detail-topline';
    topline.append(document.createTextNode(trophy.story ? 'Story trophy' : trophy.tags[0] === 'missable' ? 'Missable watch' : 'Trophy guide'));
    if (trophy.hidden) {
      const marker = document.createElement('span');
      marker.className = 'hidden-mark';
      marker.textContent = 'H';
      marker.title = 'Hidden by PlayStation until earned';
      topline.append(marker);
    }
    topline.append(gradeBadge(trophy.grade));

    const heading = document.createElement('h2');
    heading.textContent = trophy.name;
    const description = document.createElement('p');
    description.className = 'official-description';
    description.textContent = trophy.description;
    const rule = document.createElement('hr');
    rule.className = 'detail-rule';
    const guideTitle = document.createElement('h3');
    guideTitle.className = 'guide-heading';
    guideTitle.textContent = 'How to get it';
    const guide = document.createElement('p');
    guide.className = 'guide-copy';
    guide.textContent = trophy.guide;
    const citationList = document.createElement('div');
    citationList.className = 'detail-citations';
    citationList.setAttribute('aria-label', 'Sources for this guide');
    for (const citation of trophy.citations) {
      const group = renderCitation(citation);
      if (group) citationList.append(group);
    }

    const content = [topline, heading, description, rule, guideTitle, guide];
    if (trophy.confidence) {
      const confidence = document.createElement('p');
      confidence.className = 'confidence-note';
      const caution = document.createElement('strong');
      caution.textContent = 'Source note';
      const note = document.createTextNode(trophy.confidence);
      confidence.append(caution, note);
      content.push(confidence);
    }

    if (Array.isArray(trophy.steps) && trophy.steps.length) {
      const steps = document.createElement('ol');
      steps.className = 'guide-steps';
      steps.setAttribute('aria-label', 'Numbered guide steps');
      for (const [index, step] of trophy.steps.entries()) {
        const item = document.createElement('li');
        const number = document.createElement('span');
        number.className = 'guide-step-number';
        number.textContent = String(index + 1);
        const body = document.createElement('div');
        const copy = document.createElement('p');
        copy.className = 'guide-step-copy';
        copy.textContent = step.text;
        const source = sourceById.get(step.source);
        body.append(copy);
        if (source) {
          const link = document.createElement('a');
          link.className = 'guide-step-source';
          link.href = source.url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = step.sourceLabel || source.title;
          body.append(link);
        }
        item.append(number, body);
        steps.append(item);
      }
      content.push(steps);
    }

    if (trophy.target !== null) {
      const counter = document.createElement('div');
      counter.className = 'counter-box';
      const copy = document.createElement('div');
      copy.className = 'counter-copy';
      const title = document.createElement('strong');
      title.textContent = 'Manual progress';
      const hint = document.createElement('span');
      hint.textContent = `Optional note · ${trophy.targetLabel} · ${formatNumber(trophy.target)} target`;
      copy.append(title, hint);
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = String(trophy.target);
      input.step = '1';
      input.inputMode = 'numeric';
      input.value = String(state.counters[String(trophy.id)] || 0);
      input.setAttribute('aria-label', `${trophy.name} manual progress, maximum ${formatNumber(trophy.target)}`);
      input.addEventListener('change', () => setCounter(trophy, input));
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'counter-clear';
      clear.textContent = 'Clear';
      clear.addEventListener('click', () => {
        delete state.counters[String(trophy.id)];
        persist();
        renderDetail();
      });
      counter.append(copy, input, clear);
      content.push(counter);
    }

    if (!Array.isArray(trophy.steps) || !trophy.steps.length) content.push(citationList);
    const footer = document.createElement('div');
    footer.className = 'detail-footer';
    const earnedLabel = document.createElement('label');
    earnedLabel.className = 'earned-detail';
    const earned = document.createElement('input');
    earned.type = 'checkbox';
    earned.checked = isEarned(trophy);
    earned.setAttribute('aria-label', `Mark ${trophy.name} earned`);
    earned.addEventListener('change', () => setEarned(trophy, earned.checked));
    earnedLabel.append(earned, document.createTextNode('Earned'));
    const sourceCount = document.createElement('span');
    sourceCount.className = 'detail-meta';
    sourceCount.textContent = `${trophy.citations.length} ${trophy.citations.length === 1 ? 'source' : 'sources'} linked`;
    footer.append(earnedLabel, sourceCount);
    content.push(footer);
    detail.append(...content);
  }

  function setEarned(trophy, earned) {
    const next = new Set(state.earned);
    if (earned) next.add(trophy.name);
    else next.delete(trophy.name);
    state.earned = [...next];
    persist();
    renderList();
  }

  function setCounter(trophy, input) {
    const value = Number(input.value);
    if (!Number.isSafeInteger(value) || value < 0 || value > trophy.target) {
      input.setAttribute('aria-invalid', 'true');
      input.value = String(state.counters[String(trophy.id)] || 0);
      persist('Counter needs a whole number within its target');
      return;
    }
    input.removeAttribute('aria-invalid');
    if (value === 0) delete state.counters[String(trophy.id)];
    else state.counters[String(trophy.id)] = value;
    persist();
    renderDetail();
  }

  function updateProgress() {
    const earned = state.earned.length;
    el('earned-total').textContent = String(earned);
    el('progress-track').setAttribute('aria-valuenow', String(earned));
    el('progress-fill').style.width = `${(earned / data.trophies.length) * 100}%`;
    for (const [grade, total] of Object.entries(counts)) {
      const have = state.earned.filter((name) => data.trophies.find((trophy) => trophy.name === name)?.grade === grade).length;
      const out = el(`earned-${grade}`);
      if (out) out.textContent = `${have}/${total}`;
    }
  }

  function select(id) {
    selectedId = id;
    for (const item of list.querySelectorAll('.trophy-row')) {
      item.classList.toggle('is-selected', Number(item.dataset.id) === id);
    }
    renderDetail();
  }

  function renderRoadmap() {
    const stages = [
      { title: 'Protect the first chapter', label: 'Before Chapter 1 ends', text: 'Make a separate save. After Down to Earth, check the kitchen for Lucia’s invitation, follow her to the balcony and accept before Chapter 1 ends. The availability window is confirmed; whether missing it blocks the trophy is unverified.', ids: [28, 3] },
      { title: 'Follow the campaign', label: 'Story progress', text: 'Main-story trophies are listed as automatic unlocks. Keep a second save before chapter transitions and the final mission; the sources report no mission replay.', ids: [2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
      { title: 'Build repeatable progress', label: 'As activities open', text: 'Work toward 250 stunts (300 for 100%), 50 Challenges (70 for 100%) and 100 vehicle discoveries (200 base models for 100%). Complete Yago’s hourglass-marked Chapter 3 race when it appears; whether it is required for the eight counted strands is unverified.', ids: [15, 16, 17, 18, 19, 25, 30, 31, 32, 35] },
      { title: 'Finish the side strands', label: 'Free-roam cleanup', text: 'Complete named character finales and the remaining gang, robbery and location requirements. Use the trophy counter to confirm each strand counted.', ids: [22, 23, 24, 26, 27, 29, 40, 43] },
      { title: 'Use the checklist, then the sweep', label: 'After the story', text: 'The 100% checklist appears after the story under Progress > Stats > 100% Completion; earlier work still counts. Finish only its missing lines, then return to any trophy-specific requirement left.', ids: [14, 15, 17, 30, 32, 40, 54] },
      { title: 'Check the counter, claim the platinum', label: 'Final pass', text: 'Compare this browser checklist with the PS5 trophy screen, correct any uncertain manual notes, and earn each remaining trophy. The platinum is the final entry once every other trophy is earned.', ids: [1] }
    ];
    const flow = el('roadmap-flow');
    flow.replaceChildren();
    for (const [index, stage] of stages.entries()) {
      const section = document.createElement('section');
      section.className = 'roadmap-stop';
      const number = document.createElement('span');
      number.className = 'roadmap-step';
      number.textContent = String(index + 1);
      const heading = document.createElement('h3');
      heading.textContent = stage.title;
      const copy = document.createElement('p');
      copy.textContent = stage.text;
      const label = document.createElement('span');
      label.className = 'roadmap-status';
      label.textContent = stage.label;
      const chips = document.createElement('div');
      chips.className = 'roadmap-trophies';
      for (const id of stage.ids) {
        const trophy = byId.get(id);
        if (!trophy || storyMasked(trophy)) continue;
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'roadmap-chip';
        chip.textContent = trophy.name;
        chip.addEventListener('click', () => {
          setView('guide');
          filters = { query: '', kind: 'all', grade: 'all', status: 'all' };
          el('search-trophies').value = '';
          el('kind-filter').value = 'all';
          el('grade-filter').value = 'all';
          el('status-filter').value = 'all';
          select(trophy.id);
          renderList();
          window.scrollTo({ top: document.getElementById('main').offsetTop, behavior: 'smooth' });
        });
        chips.append(chip);
      }
      section.append(number, heading, copy, label, chips);
      flow.append(section);
    }
  }

  function renderSources() {
    const ledger = el('source-ledger');
    ledger.replaceChildren();
    data.sources.forEach((source, index) => {
      const item = document.createElement('article');
      item.className = 'source-entry';
      const number = document.createElement('span');
      number.className = 'source-index';
      number.textContent = String(index + 1).padStart(2, '0');
      const content = document.createElement('div');
      const anchor = document.createElement('a');
      anchor.href = source.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.textContent = source.title;
      const about = document.createElement('p');
      about.textContent = source.about;
      content.append(anchor, about);
      item.append(number, content);
      ledger.append(item);
    });
  }

  function setView(view) {
    for (const tab of document.querySelectorAll('.nav-tab')) {
      const active = tab.dataset.view === view;
      tab.classList.toggle('is-active', active);
      if (active) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    }
    el('guide-view').hidden = view !== 'guide';
    el('roadmap-view').hidden = view !== 'roadmap';
    el('sources-view').hidden = view !== 'sources';
    if (view === 'roadmap') renderRoadmap();
  }

  function exportProgress() {
    const payload = {
      format: SAVE_FORMAT,
      game: data.game,
      platform: data.platform,
      earned: [...state.earned],
      counters: { ...state.counters },
      spoilers: state.spoilers
    };
    const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leonida-waypoint-progress.json';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    persist('Progress exported');
  }

  function readImport(value) {
    let earned;
    let counters = {};
    let spoilers = false;
    if (Array.isArray(value)) {
      earned = value;
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (value.format !== SAVE_FORMAT) throw new Error('This file is not a Leonida Waypoint progress export.');
      if (value.game !== data.game || value.platform !== data.platform) throw new Error('This progress file is for another game or platform.');
      earned = value.earned;
      counters = value.counters ?? {};
      spoilers = value.spoilers === true;
    } else {
      throw new Error('The file must contain a progress object or a legacy list of earned trophy names.');
    }
    if (!Array.isArray(earned)) throw new Error('Earned progress must be a list. Nothing was changed.');
    const validNames = new Set(data.trophies.map((trophy) => trophy.name));
    const validIds = new Set(data.trophies.map((trophy) => String(trophy.id)));
    const resolved = [];
    for (const entry of earned) {
      if (typeof entry !== 'string' && typeof entry !== 'number') throw new Error('A trophy entry is not a name or ID. Nothing was changed.');
      if (typeof entry === 'string' && validNames.has(entry)) resolved.push(entry);
      else if (validIds.has(String(entry))) resolved.push(byId.get(Number(entry)).name);
      else throw new Error(`Unknown trophy in file: ${String(entry)}. Nothing was changed.`);
    }
    if (!counters || typeof counters !== 'object' || Array.isArray(counters)) throw new Error('Counter progress must be a trophy-ID object. Nothing was changed.');
    const cleanCounters = {};
    for (const [rawId, amount] of Object.entries(counters)) {
      const trophy = byId.get(Number(rawId));
      if (!trophy || trophy.target === null || !Number.isSafeInteger(amount) || amount < 0 || amount > trophy.target) {
        throw new Error(`Invalid counter for trophy ID ${rawId}. Nothing was changed.`);
      }
      if (amount > 0) cleanCounters[String(trophy.id)] = amount;
    }
    return { earned: [...new Set(resolved)], counters: cleanCounters, spoilers };
  }

  function showImport() {
    pendingImport = null;
    el('import-file').value = '';
    el('apply-import').disabled = true;
    setImportFeedback('Choose a Waypoint progress JSON file.');
    el('import-dialog').showModal();
  }

  function setImportFeedback(message, type) {
    const feedback = el('import-feedback');
    feedback.textContent = message;
    feedback.classList.toggle('is-error', type === 'error');
    feedback.classList.toggle('is-good', type === 'good');
  }

  async function prepareImport(file) {
    pendingImport = null;
    el('apply-import').disabled = true;
    if (!file) {
      setImportFeedback('Choose a Waypoint progress JSON file.');
      return;
    }
    if (file.size > 1024 * 1024) {
      setImportFeedback('This file is larger than the 1 MB import limit.', 'error');
      return;
    }
    try {
      const parsed = JSON.parse(await file.text());
      pendingImport = readImport(parsed);
      const count = pendingImport.earned.length;
      const counters = Object.keys(pendingImport.counters).length;
      setImportFeedback(`Ready: ${count} earned ${count === 1 ? 'trophy' : 'trophies'} and ${counters} manual ${counters === 1 ? 'counter' : 'counters'}. Choose Merge or Replace, then apply.`, 'good');
      el('apply-import').disabled = false;
    } catch (error) {
      pendingImport = null;
      setImportFeedback(error instanceof SyntaxError ? 'This file is not valid JSON. Nothing was changed.' : error.message, 'error');
    }
  }

  function applyImport() {
    if (!pendingImport) return;
    if (el('import-mode').value === 'merge') {
      state.earned = [...new Set([...state.earned, ...pendingImport.earned])];
      for (const [rawId, amount] of Object.entries(pendingImport.counters)) {
        state.counters[rawId] = Math.max(state.counters[rawId] || 0, amount);
      }
      state.spoilers = state.spoilers || pendingImport.spoilers;
    } else {
      state.earned = [...pendingImport.earned];
      state.counters = { ...pendingImport.counters };
      state.spoilers = pendingImport.spoilers;
    }
    persist('Progress imported');
    el('spoiler-toggle').checked = state.spoilers;
    renderList();
    renderRoadmap();
    el('import-dialog').close();
  }

  document.querySelectorAll('.nav-tab').forEach((button) => {
    button.addEventListener('click', () => {
      setView(button.dataset.view);
      if (button.dataset.view === 'guide') el('search-trophies').focus();
    });
  });
  el('search-trophies').addEventListener('input', (event) => {
    filters.query = event.target.value;
    renderList();
  });
  el('kind-filter').addEventListener('change', (event) => { filters.kind = event.target.value; renderList(); });
  el('grade-filter').addEventListener('change', (event) => { filters.grade = event.target.value; renderList(); });
  el('status-filter').addEventListener('change', (event) => { filters.status = event.target.value; renderList(); });
  el('spoiler-toggle').addEventListener('change', (event) => {
    state.spoilers = event.target.checked;
    persist();
    renderList();
    renderRoadmap();
  });
  el('clear-filters').addEventListener('click', () => {
    filters = { query: '', kind: 'all', grade: 'all', status: 'all' };
    el('search-trophies').value = '';
    el('kind-filter').value = 'all';
    el('grade-filter').value = 'all';
    el('status-filter').value = 'all';
    renderList();
  });
  el('export-progress').addEventListener('click', exportProgress);
  el('show-import').addEventListener('click', showImport);
  el('import-file').addEventListener('change', (event) => prepareImport(event.target.files[0]));
  el('apply-import').addEventListener('click', applyImport);
  el('import-dialog').addEventListener('click', (event) => {
    if (event.target === el('import-dialog')) el('import-dialog').close();
  });

  el('spoiler-toggle').checked = state.spoilers;
  renderList();
  renderRoadmap();
  renderSources();
  if (isSampleView) el('save-state').textContent = 'Sample progress · local browser only';
  if (!storageWorks) {
    el('save-state').textContent = 'Browser storage unavailable · export a backup';
    el('save-state').classList.add('is-error');
  }
})();
