#/bin/bash

SESSION="SimplePBX"
SESSIONEXISTS=$(tmux list-sessions | grep $SESSION)

# Create a session if it doesn't exist
if [ "$SESSIONEXISTS" = "" ]
then
  tmux new-session -d -s $SESSION

  # First windows is neovim
  tmux rename-window -t 0 'Neovim'
  tmux send-keys -t 'Neovim' 'nvim' C-m
  # Create a pane for quick bash
  tmux split-window -v -d -p 40
  
  # Second vindows is dev server
  tmux new-window -t $SESSION:1 -n 'Dev server'
  tmux send-keys -t 'Dev server' 'npm run dev' C-m

fi 

# Attach Session, on the Neovim window
tmux attach-session -t $SESSION:0
