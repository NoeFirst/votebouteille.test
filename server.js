// frontend script.js

document.getElementById('voteBtn').addEventListener('click', () => {
    // Effectuer une requête POST vers le serveur pour enregistrer le vote
    fetch('/vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            alert('Vote réussi !');
            document.getElementById('voteBtn').disabled = true; // Désactiver le bouton après le vote
        } else {
            alert('Erreur lors du vote');
        }
    })
    .catch(error => console.error('Erreur :', error));
});
