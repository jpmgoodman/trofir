var request = require('request');
var cheerio = require('cheerio');
var school = "Princeton University"

request('https://registrar.princeton.edu/course-offerings/search_results.xml?submit=Search&term=1162&coursetitle=&instructor=&distr_area=&level=&cat_number=&sort=SYN_PS_PU_ROXEN_SOC_VW.SUBJECT%2C+SYN_PS_PU_ROXEN_SOC_VW.CATALOG_NBR%2CSYN_PS_PU_ROXEN_SOC_VW.CLASS_SECTION%2CSYN_PS_PU_ROXEN_SOC_VW.CLASS_MTG_NBR', function (err, res, html) {
    if (!err && res.statusCode == 200) {
        var princeton_courses = [];
        var $ = cheerio.load(html);

        $tr = $('tr').first().next('tr'); // first row contained labels; skip it
        getCourseInfo($, $tr);
    }
    else {
        console.log('error occurred:');
        console.log(err);
    }
});

function getCourseInfo($, $tr) {
    code = $($tr.children()[0]).text().replace(/\s\s+|\n/g, ' ').trim();
    name_tech = $($tr.children()[1]).text().replace(/\s\s+|\n/g, ' ').trim();
    name = $($tr.children()[2]).text().replace(/\s\s+|\n/g, ' ').trim();
    distr_area = $($tr.children()[3]).text().replace(/\s\s+|\n/g, ' ').trim();
    course_sect = $($tr.children()[4]).text().replace(/\s\s+|\n/g, ' ').trim();
    time_days = $($tr.children()[5]).text().replace(/\s\s+|\n/g, ' ').trim();
    time_hours = $($tr.children()[6]).text().replace(/\s\s+|\n/g, ' ').trim();
    courseUrl = $($tr.children()[1]).children('a').attr('href');

    request('https://registrar.princeton.edu/course-offerings/' + courseUrl, function(err, res, html) {
        if (!err && res.statusCode == 200) {
            var $ = cheerio.load(html);
            var name = $('#timetable').children('h2').first().text().replace(/\s\s+|\n/g, ' ').trim();
            var prof = $('#timetable').children('p').first().text().replace(/\s\s+|\n/g, ' ').trim();
            var description = $('#descr').first().text().replace(/\s\s+|\n/g, ' ').trim();
            var course = [school, code, name, name_tech, description, time_hours, time_days, prof, distr_area, course_sect];
        }
        else {
            console.log('could not crawl to course page');
            var prof = "";
            var description = "";
            var course = [school, code, name, name_tech, description, time_hours, time_days, prof, distr_area, course_sect];
        }
        saveToCatalog(course);
        getCourseInfo($, $tr.next('tr'));

    });
}

function saveToCatalog(course) {
    var formData = {
        school_name: course[0],
        code: course[1],
        name: course[2],
        name_tech: course[3],
        description: course[4],
        time_hours: course[5],
        time_days: course[6],
        prof: course[7],
        distr_area: course[8],
        course_sect: course[9]
    }

    request.post('http://localhost:8080/api/courses').form(formData);
}
