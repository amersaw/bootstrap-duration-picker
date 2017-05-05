(function($) {
  const langs = {
    en: {
      year: 'year',
      month: 'month',
      day: 'day',
      hour: 'hour',
      minute: 'minute',
      second: 'second',
      months: 'months',
      years: 'years',
      days: 'days',
      hours: 'hours',
      minutes: 'minutes',
      seconds: 'seconds',
    },
    tr: {
      year: 'yıl',
      month: 'ay',
      day: 'gün',
      hour: 'saat',
      minute: 'dakika',
      second: 'saniye',
      years: 'yıl',
      months: 'ay',
      days: 'gün',
      hours: 'saat',
      minutes: 'dakika',
      seconds: 'saniye',
    },
    fr: {
      day: 'jour',
      hour: 'heure',
      minute: 'minute',
      second: 'seconde',
      days: 'jours',
      hours: 'heures',
      minutes: 'minutes',
      seconds: 'secondes',
    },
  };

  $.fn.durationPicker = function(options) {
    const defaults = {
      lang: 'en',
      showSeconds: false,
      showMinutes: true,
	  showHours: true,
      showDays: true,
	  showMonths: false,
	  showYears: false
    };
    const settings = $.extend({}, defaults, options);

    this.each((i, mainInput) => {
      mainInput = $(mainInput);

      if (mainInput.data('bdp') === '1') return;

      const inputs = [],
        labels = [],
        disabled = mainInput.hasClass('disabled') ||
          mainInput.attr('disabled') === 'disabled';

      function translate(key) {
        if (typeof settings.lang === 'string') {
          return langs[settings.lang][key];
        }
        return settings.lang[key];
      }

      function buildDisplayBlock(id, hidden, max) {
        const input = $('<input>', {
          class: 'form-control input-sm',
          type: 'number',
          min: 0,
          value: 0,
          disabled: disabled,
        }).change(durationPickerChanged);
        if (max) {
          input.attr('max', max);
        }
        inputs[id] = input;

        const label = $('<div>', {
          id: `bdp-${id}-label`,
          text: translate(id),
        });
        labels[id] = label;

        return $('<div>', {
          class: `bdp-block ${hidden ? 'hidden' : ''}`,
          html: [input, label],
        });
      }

      const mainInputReplacer = $('<div>', {
        class: 'bdp-input',
        html: [
          buildDisplayBlock('years', !settings.showYears),
          buildDisplayBlock('months', !settings.showMonths,settings.showYears ? 12 : 99999),
          buildDisplayBlock('days', !settings.showDays,settings.showMonths ? 31 : 99999),
          buildDisplayBlock('hours', !settings.showHours, settings.showDays ? 23 : 99999),
          buildDisplayBlock('minutes', !settings.showMinutes, 59),
          buildDisplayBlock('seconds', !settings.showSeconds, 59),
        ],
      });

      mainInput.after(mainInputReplacer).hide().data('bdp', '1');

      let years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0;

      function updateWordLabel(value, label) {
        const text = value === 1 ? label.substring(0, label.length - 1) : label;
        labels[label].text(translate(text));
      }

      function updateUI() {
        const total = seconds +
          minutes * 60 +
          hours * 60 * 60 +
          days * 24 * 60 * 60 +
		  months * 30 * 24 * 60 * 60 +
		  years * 365 * 24 * 60 * 60;
        mainInput.val(total);
        mainInput.change();

        updateWordLabel(years, 'years');
        updateWordLabel(months, 'months');
        updateWordLabel(days, 'days');
        updateWordLabel(hours, 'hours');
        updateWordLabel(minutes, 'minutes');
        updateWordLabel(seconds, 'seconds');

        inputs.years.val(years);
        inputs.months.val(months);
        inputs.days.val(days);
        inputs.hours.val(hours);
        inputs.minutes.val(minutes);
        inputs.seconds.val(seconds);

        if (typeof settings.onChanged === 'function') {
          settings.onChanged(mainInput.val());
        }
        if (typeof settings.onChangedVerbose === 'function') {
          settings.onChangedVerbose(years,months,days,hours,minutes,seconds);
        }
      }

      function init() {
        if (mainInput.val() === '') mainInput.val(0);

        let total = parseInt(mainInput.val(), 10);
        seconds = total % 60;
        total = Math.floor(total / 60);
        minutes = total % 60;
        total = Math.floor(total / 60);

        if (settings.showDays) {
          hours = total % 24;
          days = Math.floor(total / 24);
        } else {
          hours = total;
          days = 0;
        }

        updateUI();
      }

      function durationPickerChanged() {
        years = parseInt(inputs.years.val(), 10) || 0;
        months = parseInt(inputs.months.val(), 10) || 0;
        
		days = parseInt(inputs.days.val(), 10) || 0;
        hours = parseInt(inputs.hours.val(), 10) || 0;
        minutes = parseInt(inputs.minutes.val(), 10) || 0;
        seconds = parseInt(inputs.seconds.val(), 10) || 0;
        updateUI();
      }

      init();
    });
  };
})(jQuery);
