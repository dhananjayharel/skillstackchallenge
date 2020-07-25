interface Scripts {
    name: string;
    src: string;
}
export const ScriptStore: Scripts[] = [
    {name: 'tinymce', src: '/assets/tinymce/tinymce.min.js'},
    {name: 'tinymcetheme', src: '/assets/tinymce/themes/modern/theme.min.js'},
    {name: 'pipe', src: '//cdn.addpipe.com/2.0/pipe.js'}
];
