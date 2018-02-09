/**
 * @author Susann Sgorzaly <sgorzaly@portrino.com>
 */

(function ($) {
    'use strict';
    var sprintf = $.fn.bootstrapTable.utils.sprintf;

    $.extend($.fn.bootstrapTable.defaults, {
        idField: 'id',
        showSummary: true,
        summaryOptions: {},
        summaryData: {
            'total': 0,
            'shown': 0,
            'selected': 0,
            // for backend postprocessing if not all data were loaded
            'selectedAll': false,
            // ids if selectAll was never checked or unchecked during work
            // otherwise for backend postprocessing if not all data were
            // loaded, but all were selected and some deselected (this saves
            // than the deselected ids)
            'rowIds': []
        },
        responseHandler: function (res) {
            var _formatSummary = $.fn.bootstrapTable.locales.formatSummary;
            var options = $.fn.bootstrapTable.defaults;

            options.summaryData.total = res[options.totalField];
            options.summaryData.shown = res.totalRows;
            $('.data-summary').text(
                _formatSummary(res[options.totalField], res.totalRows)
            );

            $.fn.bootstrapTable.defaults = options;
            return res;
        },

        onCheckAll: function () {
            var _formatSummarySelected = $.fn.bootstrapTable.locales.formatSummarySelected;
            var options = $.fn.bootstrapTable.defaults;
            options.summaryData.selected = options.summaryData.shown;
            options.summaryData.selectedAll = true;
            options.summaryData.rowIds = [];
            $('.data-summary-selected').text(
                _formatSummarySelected(options.summaryData.selected)
            );

            $.fn.bootstrapTable.defaults = options;
            return false;
        },

        onUncheckAll: function () {
            var _formatSummarySelected = $.fn.bootstrapTable.locales.formatSummarySelected;
            var options = $.fn.bootstrapTable.defaults;
            options.summaryData.selected = 0;
            options.summaryData.selectedAll = false;
            options.summaryData.rowIds = [];
            $('.data-summary-selected').text(
                _formatSummarySelected(options.summaryData.selected)
            );

            $.fn.bootstrapTable.defaults = options;
            return false;
        },
        onCheck: function (row) {
            var _formatSummarySelected = $.fn.bootstrapTable.locales.formatSummarySelected;
            var options = $.fn.bootstrapTable.defaults;
            options.summaryData.selected += 1;
            options.summaryData.rowIds.push(row[options.idField]);
            $('.data-summary-selected').text(
                _formatSummarySelected(options.summaryData.selected)
            );

            $.fn.bootstrapTable.defaults = options;
            return false;
        },
        onUncheck: function (row) {
            var _formatSummarySelected = $.fn.bootstrapTable.locales.formatSummarySelected;
            var options = $.fn.bootstrapTable.defaults;
            options.summaryData.selected -= 1;
            if (options.summaryData.selectedAll) {
                options.summaryData.rowIds.push(row[options.idField]);
            }
            else {
                options.summaryData.rowIds.splice($.inArray(row[options.idField], options.summaryData.rowIds), 1);
            }
            $('.data-summary-selected').text(
                _formatSummarySelected(options.summaryData.selected)
            );

            $.fn.bootstrapTable.defaults = options;
            return false;
        }
    });

    $.extend($.fn.bootstrapTable.locales, {
        formatSummary: function (totalCount, shownCount) {
            return sprintf('Showing %s of %s entries', shownCount, totalCount);
        },
        formatSummarySelected: function (selectedCount) {
            return sprintf(' (%s selected) ', selectedCount);
        }
    });
    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales);

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _init = BootstrapTable.prototype.init,
        _initToolbar = BootstrapTable.prototype.initToolbar;

    BootstrapTable.prototype.init = function () {
        _init.apply(this, Array.prototype.slice.apply(arguments));
    };

    BootstrapTable.prototype.initToolbar = function () {
        this.showToolbar = this.options.showSummary;

        _initToolbar.apply(this, Array.prototype.slice.apply(arguments));

        if (this.options.showSummary) {
            var $btnGroup = this.$toolbar.find('>.btn-group'),
                $summary = $btnGroup.find('div.summary');
            if (!$summary.length) {
                $summary = $([
                    '<div class="info btn-group">',
                    '<span class="data-summary">' +
                    this.options.formatSummary(this.options.summaryData.total, this.options.summaryData.shown) +
                    '</span>',
                    '<span class="data-summary-selected">' +
                    this.options.formatSummarySelected(this.options.summaryData.selected) +
                    '</span>',
                    '</div>'].join('')).prependTo($btnGroup);
            }
        }
    };
})(jQuery);
