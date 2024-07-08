
    const darkModeToggle = document.querySelector('#darkMode');
    

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        document.querySelector('header').classList.toggle('dark');
        document.querySelector('footer').classList.toggle('dark');
        document.querySelector('.developer-info').classList.toggle('dark');
        document.querySelector('.intro').classList.toggle('dark');

        const icon = darkModeToggle.querySelector('i');
        
        if (document.body.classList.contains('dark')){
            icon.classList.replace('fa-moon', 'fa-sun');
        }else{
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });
